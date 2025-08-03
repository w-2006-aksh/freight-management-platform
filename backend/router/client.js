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
const { getIO } = require("../config/socket.js");

const { NewBidBroadcastJob } = require("../queue/newBidBroadcast");
const {
  addBidWinnerNotificationJob,
} = require("../queue/bidWinnerNotifications");

router.get("/getCities", (req, res, next) => {
  try {
    return res.status(200).json({ data: citydata });
  } catch (error) {
    return next(createNewError("Failed to fetch cities", 500));
  }
});

router.post(
  "/postABid",
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

router.get("/liveBids", async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          client: new Types.ObjectId(req.user._id),
          status: "active",
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

router.get("/completedBids", async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          client: new Types.ObjectId(req.user._id.toString()),
          status: "completed",
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

    const completedBids = await Bid.aggregate(pipeline);
    return res.status(200).json({ success: true, completedBids });
  } catch (error) {
    return next(createNewError("Internal server error", 500));
  }
});

router.get("/inProgressBids", async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          client: new Types.ObjectId(req.user._id.toString()),
          status: { $nin: ["active", "completed"] },
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

router.get("/:bidId/seeQuotes", async (req, res, next) => {
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

router.post("/:bidId/acceptQuote", async (req, res, next) => {
  try {
    const bidId = req.params.bidId;
    const bid = await Bid.findById(bidId);

    if (bid.status != "active") {
      return next(createNewError("Quote was already selected before", 409));
    }

    const bidObjectId = req.params.bidId;
    const { transporter, quotedPrice } = req.body;

    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      {
        selectedTransporter: transporter._id,
        status: "Awaiting transport details",
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

router.post("/:bidId/confirmDetails", async (req, res, next) => {
  const bidId = req.params.bidId;
  try {
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return next(createNewError("No such bid!", 404));
    }

    if (bid.status !== "Awaiting detail confirmation") {
      return next(createNewError("Cannot perform action!", 403));
    }

    await Bid.updateOne(
      { _id: bidId },
      { status: "en route", importantForClient: false }
    );
    return res.status(200).json({ success: true });
  } catch {
    return next(createNewError("Internal server error", 500));
  }
});

module.exports = router;
