const express = require("express");
const router = express.Router();
const Bid = require("../models/bid");
const confirmationOTPCollection = require("../models/confirmationOTP");
const jwt = require("jsonwebtoken");
const reverseGeocode = require("../util/reverseGeoLocator");

router.get("/get-bid-details/:bidNo/", async (req, res) => {
  try {
    const bidNo = Number(req.params.bidNo);
    const bid = await Bid.findOne({ bidNo });
    if (!bid)
      return res.status(404).json({ success: false, message: "No such bid" });
    return res.status(200).json({ success: true, bid });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

function verifyTripToken(req, res, next) {
  const auth = req.headers.authorization;
  console.log("request from app receievd");
  console.log(auth);
  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.TRIP_SECRET);
    req.trip = decoded;
    next();
  } catch (e) {
    console.log("error in app auth : ", e.message);
    return res.sendStatus(401);
  }
}

router.get("/get-bid-status/:bidNo", verifyTripToken, async (req, res) => {
  try {
    const bidNo = Number(req.params.bidNo);

    if (req.trip.bidNo !== bidNo) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bid = await Bid.findOne({ bidNo });
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "No such bid",
      });
    }

    return res.status(200).json({
      success: true,
      status: bid.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/mark-as-picked/:bidNo", verifyTripToken, async (req, res) => {
  try {
    const bidNo = Number(req.params.bidNo);

    if (req.trip.bidNo !== bidNo) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    const bid = await Bid.findOne({ bidNo });
    if (!bid) {
      return res.status(404).json({ success: false, message: "No such bid" });
    }

    if (bid.status !== "Awaiting Pickup") {
      return res.status(409).json({
        success: false,
        message: "Cannot mark pickup in current state",
      });
    }

    const updatedBid = await Bid.findOneAndUpdate(
      { bidNo },
      { $set: { status: "In Transit" } },
      { new: true }
    );
    console.log(updatedBid);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/mark-as-delivered/:bidNo", verifyTripToken, async (req, res) => {
  try {
    const bidNo = Number(req.params.bidNo);
    const enteredOTP = req.body.OTP;

    if (req.trip.bidNo !== bidNo) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    const otpDoc = await confirmationOTPCollection.findOne({ bidNo });
    console.log(bidNo);
    if (!otpDoc) {
      return res.status(404).json({ success: false, message: "No OTP found" });
    }

    if (otpDoc.OTP != enteredOTP) {
      return res.status(403).json({ success: false, message: "Incorrect OTP" });
    }

    const updatedBid = await Bid.findOneAndUpdate(
      { bidNo },
      { $set: { status: "Delivered" } },
      { new: true }
    );

    await confirmationOTPCollection.findOneAndDelete({ bidNo });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/update-location/:bidNo", verifyTripToken, async (req, res) => {
  try {
    const bidNo = Number(req.params.bidNo);
    const { lat, lng } = req.body;

    if (req.trip.bidNo !== bidNo) {
      return res.status(403).json({ success: false });
    }

    const bid = await Bid.findOne({ bidNo });
    if (!bid) return res.sendStatus(404);

    const city = await reverseGeocode(lat, lng);

    const lastCity = bid.journey?.at(-1)?.city;

    if (lastCity === city) {
      return res.json({ success: true, updated: false });
    }

    await Bid.updateOne({ bidNo }, { $push: { journey: { city, lat, lng } } });
    res.json({ success: true, updated: true, city });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
