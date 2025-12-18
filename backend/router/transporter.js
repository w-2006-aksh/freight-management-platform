const express = require("express");
const router = express.Router();
const Bid = require("../models/bid");
const { Types } = require("mongoose");
const Quote = require("../models/quote");
const upload = require("../storage/multer");
const createNewError = require("../util/createNewError");
const { getIO } = require("../config/socket.js");
const {
  postDetailsSchema,
} = require("../formDataValidate/transporter/postDetails");
const validate = require("../middleware/formDataValidator");

router.get("/live-bids", async (req, res, next) => {
  try {
    const myQuotes = await Quote.find({ transporter: req.user._id }).distinct(
      "bidNo"
    );
    const liveBids = await Bid.find({
      status: "Live",
      bidNo: { $nin: myQuotes },
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, liveBids });
  } catch (error) {
    return next(createNewError("Failed to fetch live bids", 500));
  }
});

router.get("/my-bids", async (req, res, next) => {
  try {
    const transporterId = req.user._id;
    const myBids = await Bid.find({ selectedTransporter: transporterId }).sort({
      live: -1,
      importantForTransporter: -1,
      createdAt: -1,
    });
    return res.status(200).json({ success: true, myBids });
  } catch (error) {
    return next(createNewError("Failed to fetch your bids", 500));
  }
});

router.post("/:bidNo/post-a-quote", async (req, res, next) => {
  try {
    const { quotedPrice } = req.body;
    const bidNo = req.params.bidNo;
    const bid = await Bid.findOne({ bidNo });
    console.log("working till bid find");
    const existingQuote = await Quote.findOne({
      bidNo,
      transporter: req.user._id,
    });
    if (existingQuote != null) {
      return next(createNewError("Cannot make multiple quotes!", 409));
    }

    const quote = await Quote.create({
      quotedPrice,
      bidNo,
      transporter: new Types.ObjectId(req.user._id),
    });
    console.log("working till quote submit");
    const io = getIO();
    const populatedQuote = await quote.populate(
      "transporter",
      "name email phNo"
    );
    console.log("quote submitted by", req.user._id.toString());
    io.to(req.user._id.toString()).emit("quote-submitted", { bidNo });
    console.log("quote submit bidNo", bidNo);
    console.log("transporterid is", req.user._id.toString());
    io.to(bid.client._id.toString()).emit("new-quote", populatedQuote);
    console.log("working till io and client id is ", bid.client._id.toString());
    return res
      .status(200)
      .json({ success: true, message: "Quote successfully registered!" });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

const handleUpload = (req, res, next) => {
  const uploadHandler = upload.fields([
    { name: "driverLicense", maxCount: 1 },
    { name: "vehicleDocument", maxCount: 1 },
  ]);

  uploadHandler(req, res, (error) => {
    if (error) {
      return next(
        createNewError(
          "Upload failed! Check size and format of documents!",
          400
        )
      );
    }
    return next();
  });
};

router.post(
  "/:bidId/upload-details",
  handleUpload,
  validate(postDetailsSchema),
  async (req, res, next) => {
    try {
      const bidId = req.params.bidId.toString();
      const bid = await Bid.findById(bidId);

      if (!bid) {
        return next(createNewError("No such bid", 404));
      }

      if (bid.transportDetails) {
        return next(createNewError("Transport details already uploaded", 409));
      }

      const currentTransporterId = req.user._id;

      if (
        bid.selectedTransporter.toString() != currentTransporterId.toString()
      ) {
        return next(createNewError("Not authorised!", 403));
      }

      if (
        !req.files ||
        !req.files.driverLicense ||
        !req.files.vehicleDocument
      ) {
        return next(
          createNewError(
            "Both driver license and vehicle document are required!",
            400
          )
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
          importantForClient: true,
          importantForTransporter: false,
        },
        { new: true }
      ).populate("selectedTransporter", "name email phNo");

      const io = getIO();
      console.log("the client is", updatedBid.client.toString());
      io.to(updatedBid.client.toString()).emit("details-uploaded", updatedBid);
      io.to(req.user._id).emit("details-uploaded", updatedBid);
      return res
        .status(200)
        .json({ success: true, message: "Upload Successful!" });
    } catch (error) {
      console.error("Upload error:", error);
      return next(createNewError("Internal server error", 500));
    }
  }
);

module.exports = router;
