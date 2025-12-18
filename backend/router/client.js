const express = require("express");
const router = express.Router();
const citydata = require("../data/cities.json");
const formDataValidator = require("../middleware/formDataValidator");
const { postABidSchema } = require("../formDataValidate/client/postABid");
const { Types } = require("mongoose");
const Bid = require("../models/bid");
const getBidNo = require("../controllers/clientControllers/bidNo");
const Quote = require("../models/quote");
const createNewError = require("../util/createNewError");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { getIO } = require("../config/socket.js");
const confirmationOTPCollection = require("../models/confirmationOTP");

const { generateTripToken } = require("../util/generateTripToken.js");

const { addDriverLinkJob } = require("../queue/driverlink.js");

const { NewBidBroadcastJob } = require("../queue/newBidBroadcast");
const {
  addBidWinnerNotificationJob,
} = require("../queue/bidWinnerNotifications");

const {
  addOTPDeliveryConfirmation,
} = require("../queue/OTPDeliveryConfirmation.js");

router.get("/getCities", (req, res, next) => {
  try {
    return res.status(200).json({ data: citydata });
  } catch (error) {
    return next(createNewError("Failed to fetch cities", 500));
  }
});

router.post(
  "/post-a-bid",
  formDataValidator(postABidSchema),
  async (req, res, next) => {
    try {
      const { from, to, load, commodity, startDate, endDate } = req.body;
      const bidNo = await getBidNo();

      const bid = await Bid.create({
        from,
        to,
        load,
        commodity,
        startDate,
        bidNo,
        endDate,
        client: req.user._id,
      });

      await NewBidBroadcastJob(bidNo);
      const io = getIO();
      io.to("transporters").emit("new-bid-posted", bid);
      io.to(req.user._id).emit("new-bid-posted", bid);

      return res
        .status(200)
        .json({ success: true, message: "Bid created successfully", bid });
    } catch (error) {
      return next(createNewError("Internal server error", 500));
    }
  }
);

router.get("/live-bids", async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          client: new Types.ObjectId(req.user._id),
          status: "Live",
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const liveBids = await Bid.aggregate(pipeline);

    return res.status(200).json({ success: true, liveBids });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.get("/delivered-bids", async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          client: new Types.ObjectId(req.user._id.toString()),
          status: "Delivered",
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $lookup: {
          from: "transporters",
          localField: "selectedTransporter",
          foreignField: "_id",
          as: "selectedTransporter",
        },
      },

      {
        $unwind: "$selectedTransporter",
      },
    ];

    const deliveredBids = await Bid.aggregate(pipeline);
    return res.status(200).json({ success: true, deliveredBids });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.get("/in-progress-bids", async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          client: new Types.ObjectId(req.user._id.toString()),
          status: { $nin: ["Live", "Delivered"] },
        },
      },
      {
        $sort: {
          importantForClient: -1,
          createdAt: -1,
        },
      },

      {
        $lookup: {
          from: "transporters",
          localField: "selectedTransporter",
          foreignField: "_id",
          as: "selectedTransporter",
        },
      },
      {
        $unwind: "$selectedTransporter",
      },
    ];

    const inProgressBids = await Bid.aggregate(pipeline);
    return res.status(200).json({ success: true, inProgressBids });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.get("/:bidId/see-quotes", async (req, res, next) => {
  try {
    const bidId = req.params.bidId;
    const bid = await Bid.findById(bidId);

    if (!bid) {
      return next(createNewError("Bid not found!", 404));
    }

    const quotes = await Quote.find({ bidNo: bid.bidNo })
      .populate("transporter", "name email phNo address")
      .sort({ quotedPrice: 1 });
    return res.status(200).json({
      success: true,
      bidDetails: bid,
      quotes,
    });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.post("/:bidId/accept-quote", async (req, res, next) => {
  try {
    const bidId = req.params.bidId;
    const bid = await Bid.findById(bidId);

    if (bid.status != "Live") {
      return next(createNewError("Quote was already selected before", 409));
    }

    const bidObjectId = req.params.bidId;
    const { transporter, quotedPrice } = req.body;

    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      {
        selectedTransporter: transporter._id,
        status: "Awaiting Transport Details",
        importantForClient: false,
        finalPrice: quotedPrice,
        importantForTransporter: true,
      },
      { new: true }
    ).populate("selectedTransporter", "phNo email name");

    const io = getIO();

    io.to(transporter._id).emit("bid-won", updatedBid);
    io.to(req.user._id.toString()).emit("bid-accepted", updatedBid);
    console.log("bidupdatedonacceptance is", updatedBid);
    addBidWinnerNotificationJob(bid.bidNo, transporter.phNo);
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.get("/:bidId/Details", async (req, res, next) => {
  const bidId = req.params.bidId;
  console.log("req rec");
  try {
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return next(createNewError("No such bid!", 404));
    }

    return res.status(200).json({ success: true, bid });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.post("/:bidId/confirm-details", async (req, res, next) => {
  try {
    const bidId = req.params.bidId;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return next(createNewError("No such bid!", 404));
    }

    if (bid.status !== "Awaiting Detail Confirmation") {
      return next(createNewError("Cannot perform action!", 403));
    }

    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      {
        status: "Awaiting Pickup",
        importantForClient: false,
      },
      { new: true }
    ).populate([
      { path: "client", select: "phNo" },
      { path: "selectedTransporter", select: "name email phNo" },
    ]);

    if (!updatedBid) {
      return next(createNewError("Bid update failed", 500));
    }

    const OTP = crypto.randomInt(1000, 10000);
    console.log("otp generated : ", OTP);
    await confirmationOTPCollection.insertOne({
      bidNo: updatedBid.bidNo,
      OTP,
    });

    await addOTPDeliveryConfirmation(
      OTP,
      updatedBid.client.phNo,
      updatedBid.transportDetails.driverPhNo,
      updatedBid.bidNo
    );

    const link = generateTripToken({
      bidNo: updatedBid.bidNo,
      from: updatedBid.from,
      to: updatedBid.to,
    });

    console.log("link:", link);
    await addDriverLinkJob(
      updatedBid.transportDetails.driverPhNo,
      updatedBid.bidNo,
      link
    );

    return res.status(200).json({
      success: true,
      bid: updatedBid,
    });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.get("/:bidNo/journey", async (req, res) => {
  const bidNo = Number(req.params.bidNo);

  const bid = await Bid.findOne({ bidNo });
  if (!bid) return res.sendStatus(404);

  if (bid.client.toString() !== req.user._id.toString()) {
    return res.sendStatus(403);
  }

  res.json({
    success: true,
    status: bid.status,
    journey: bid.journey,
  });
});

module.exports = router;
