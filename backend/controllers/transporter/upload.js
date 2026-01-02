const Bid = require("../../model/bid");
const createNewError = require("../../util/createNewError");
const { getIO } = require("../../config/socket");

exports.uploadDetails = async (req, res, next) => {
  try {
    const bidId = req.params.bidId;
    const bid = await Bid.findById(bidId);

    if (!bid) throw createNewError("No such bid", 404);
    if (bid.transportDetails)
      throw createNewError("Transport details already uploaded", 409);

    if (bid.selectedTransporter.toString() !== req.user._id.toString())
      throw createNewError("Not authorised!", 403);

    if (!req.files?.driverLicense || !req.files?.vehicleDocument) {
      throw createNewError(
        "Both driver license and vehicle document are required!",
        400
      );
    }

    const { driverName, driverPhNo, vehicleNo } = req.body;

    const driverLicenseUrl = req.files.driverLicense[0].path.replace(
      "public\\",
      ""
    );
    const vehicleDocumentUrl = req.files.vehicleDocument[0].path.replace(
      "public\\",
      ""
    );

    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      {
        transportDetails: {
          driverName,
          driverPhNo,
          vehicleNo,
          driverLicenseUrl,
          vehicleDocumentUrl,
        },
        status: "Awaiting Detail Confirmation",
      },
      { new: true }
    ).populate("selectedTransporter", "name email phNo");

    const io = getIO();
    io.to(updatedBid.client.toString()).emit("details-uploaded", updatedBid);
    io.to(req.user._id.toString()).emit("details-uploaded", updatedBid);

    return res
      .status(200)
      .json({ success: true, message: "Upload Successful!" });
  } catch (err) {
    next(err);
  }
};
