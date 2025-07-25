const express = require("express");
const router = express.Router();
const Bid = require("../models/bid");
const { Types } = require("mongoose");
const Quote = require("../models/quote");
const upload = require("../storage/multer");
const createNewError = require("../util/createNewError");
const {postDetailsSchema} = require("../formDataValidate/transporter/postDetails");
const validate = require("../middleware/formDataValidator");

router.get("/liveBids", async (req, res, next) => {
  try {
    const myQuotes = await Quote.find({ transporter: req.user._id }).distinct(
      "bidNo"
    );
    const liveBids = await Bid.find({
      status: "active",
      bidNo: { $nin: myQuotes },
    });

    return res.status(200).json({ success: true, liveBids });
  } catch (error) {
    return next(createNewError("Failed to fetch live bids", 500));
  }
});

router.get("/myBids", async (req, res, next) => {
  try {
    const transporterId = req.user._id;
    const myBids = await Bid.find({ selectedTransporter: transporterId });
    return res.status(200).json({ success: true, myBids });
  } catch (error) {
    return next(createNewError("Failed to fetch your bids", 500));
  }
});

router.post("/:bidNo/postAQuote", async (req, res, next) => {
  try {
    const { quotedPrice } = req.body;
    const bidNo = req.params.bidNo;

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
      // console.log("error in uploading at line 69 in routes");
      return next(
        createNewError(
          "Upload failed! Check size and format of documents!",
          400
        )
      );
    }
    // console.log("uploaded!");
    return next();
  });
};

router.post(
  "/:bidId/uploadDetails",
  handleUpload,
  validate(postDetailsSchema),
  async (req, res, next) => {
    try {
      const bidId = req.params.bidId.toString();
      const bid = await Bid.findById(bidId);
      console.log(bid);
      if (!bid) {
        return next(createNewError("No such bid", 404));
      }

      if (bid.transportDetails) {
        return next(createNewError("Transport details already uploaded", 409));
      }

      const currentTransporterId = req.user._id;
      console.log("currentTransp", currentTransporterId);
      console.log("selected is", bid.selectedTransporter.toString());

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

      await Bid.updateOne(
        { _id: new Types.ObjectId(bidId) },
        {
          transportDetails: {
            driverName,
            driverPhNo,
            vehicleNo,
            driverLicenseUrl,
            vehicleDocumentUrl,
          },
          status: "Awaiting detail confirmation",
        }
      );

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
