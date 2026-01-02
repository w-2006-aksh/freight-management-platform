const Bid = require("../../model/bid");
const ConfirmationOTP = require("../../model/confirmationOTP");
const createNewError = require("../../util/createNewError");
const reverseGeocode = require("../../util/reverseGeoLocator");

exports.getTripDetails = async (req, res, next) => {
  try {
    const bidNo = Number(req.params.bidNo);

    const bid = await Bid.findOne({ bidNo });
    if (!bid) {
      throw createNewError("No such trip", 404);
    }

    return res.status(200).json({
      success: true,
      trip: {
        bidNo,
        from: bid.from,
        to: bid.to,
        startDate: bid.startDate,
        endDate: bid.endDate,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTripStatus = async (req, res, next) => {
  try {
    const bidNo = Number(req.params.bidNo);
    if (req.trip.bidNo !== bidNo) {
      throw createNewError("Unauthorized", 403);
    }

    const bid = await Bid.findOne({ bidNo });
    if (!bid) {
      throw createNewError("No such trip", 404);
    }

    return res.status(200).json({
      success: true,
      status: bid.status,
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsPicked = async (req, res, next) => {
  try {
    const bidNo = Number(req.params.bidNo);

    if (req.trip.bidNo !== bidNo) {
      throw createNewError("Unauthorized action", 403);
    }

    const bid = await Bid.findOne({ bidNo });
    if (!bid) {
      throw createNewError("No such trip", 404);
    }
    if (bid.status == "In Transit") {
      return res.status(200).json({ success: true });
    }
    if (bid.status !== "Awaiting Pickup") {
      throw createNewError("Cannot mark pickup in current state", 409);
    }

    await Bid.updateOne({ bidNo }, { $set: { status: "In Transit" } });

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.markAsDelivered = async (req, res, next) => {
  try {
    const bidNo = Number(req.params.bidNo);
    const { OTP } = req.body;

    if (req.trip.bidNo !== bidNo) {
      throw createNewError("Unauthorized action", 403);
    }

    const OTPDoc = await ConfirmationOTP.findOne({ bidNo });
    if (!OTPDoc) {
      throw createNewError("No OTP found", 404);
    }

    if (OTPDoc.OTP.toString() !== OTP.toString()) {
      throw createNewError("Incorrect OTP", 403);
    }

    await Bid.updateOne({ bidNo }, { $set: { status: "Delivered" } });

    await ConfirmationOTP.deleteOne({ bidNo });

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const bidNo = Number(req.params.bidNo);
    const { lat, lng } = req.body;

    if (req.trip.bidNo !== bidNo) {
      throw createNewError("Unauthorized", 403);
    }

    const bid = await Bid.findOne({ bidNo });
    if (!bid) {
      throw createNewError("No such trip", 404);
    }

    const city = await reverseGeocode(lat, lng);

    const lastCity = bid.journey?.at(-1)?.city;
    if (lastCity === city) {
      return res.status(200).json({
        success: true,
        updated: false,
      });
    }

    await Bid.updateOne({ bidNo }, { $push: { journey: { city, lat, lng } } });

    return res.status(200).json({
      success: true,
      updated: true,
      city,
    });
  } catch (err) {
    next(err);
  }
};

exports.openBidInApp = (req, res) => {
  const { bidNo } = req.params;
  const token = req.query.token;

  if (!token) {
    return res.status(400).send("Invalid link");
  }

  res.redirect(`gpslocator://bid?bidNo=${bidNo}&token=${token}`);
};
