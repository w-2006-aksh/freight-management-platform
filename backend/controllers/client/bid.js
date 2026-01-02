const { Types } = require("mongoose");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Bid = require("../../model/bid");
const ConfirmationOTP = require("../../model/confirmationOTP");

const createNewError = require("../../util/createNewError");
const generateBidNo = require("../../util/generateBidNo");
const { secondsUntilEndOfDay } = require("../../util/timeUntilEndofDay");
const { dailyBidLimit } = require("../../config/limits");

const generateTripToken = require("../../util/generateTripToken");

const { addDriverLinkJob } = require("../../queue/driverLink");
const bidInvitation = require("../../model/bidInvitation");
const Client = require("../../model/client");
const redisClient = require("../../config/redis");

const {
  addOTPDeliveryConfirmation,
} = require("../../queue/OTPDeliveryConfirmation");

exports.createBid = async (req, res, next) => {
  try {
    const clientId = req.user._id.toString();
    const { from, to, load, commodity, startDate, endDate } = req.body;

    const dailyKey = `bid:daily:${clientId}`;
    const currentCount = Number(await redisClient.get(dailyKey)) || 0;

    if (currentCount >= dailyBidLimit) {
      throw createNewError(
        "You've reached today's bid posting limit. Please try again tomorrow.",
        429
      );
    }

    const client = await Client.findById(clientId);

    if (!client || client.trustedTransporters.length === 0) {
      throw createNewError(
        "Add at least one transporter to trusted transporters list to start posting bids!",
        409
      );
    }

    const bidNo = await generateBidNo();
    const expiresAt = new Date(startDate);

    const bid = await Bid.create({
      from,
      to,
      load,
      commodity,
      startDate,
      endDate,
      bidNo,
      expiresAt,
      client: clientId,
    });

    await bidInvitation.create({
      bid: bid._id,
      client: clientId,
      allowedTransporters: client.trustedTransporters,
    });

    const newCount = await redisClient.incr(dailyKey);
    if (newCount === 1) {
      await redisClient.expire(dailyKey, secondsUntilEndOfDay());
    }

    return res.status(201).json({
      success: true,
      message: "Bid created successfully",
      bid,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLiveBids = async (req, res, next) => {
  try {
    const liveBids = await Bid.aggregate([
      {
        $match: {
          client: new Types.ObjectId(req.user._id),
          status: "Live",
          expiresAt: { $gt: new Date() },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          bidNo: 1,
          from: 1,
          to: 1,
          startDate: 1,
          endDate: 1,
          load: 1,
          status: 1,
        },
      },
    ]);

    return res.status(200).json({ success: true, liveBids });
  } catch (err) {
    next(err);
  }
};

exports.getDeliveredBids = async (req, res, next) => {
  try {
    const deliveredBids = await Bid.aggregate([
      {
        $match: {
          client: new Types.ObjectId(req.user._id),
          status: "Delivered",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "transporters",
          localField: "selectedTransporter",
          foreignField: "_id",
          as: "selectedTransporter",
        },
      },
      { $unwind: "$selectedTransporter" },
      {
        $project: {
          _id: 1,
          bidNo: 1,
          from: 1,
          to: 1,
          startDate: 1,
          endDate: 1,
          load: 1,
          status: 1,
          finalPrice: 1,
          selectedTransporter: {
            name: 1,
            email: 1,
            phNo: 1,
          },
        },
      },
    ]);

    return res.status(200).json({ success: true, deliveredBids });
  } catch (err) {
    next(err);
  }
};

exports.getInProgressBids = async (req, res, next) => {
  try {
    const inProgressBids = await Bid.aggregate([
      {
        $match: {
          client: new Types.ObjectId(req.user._id),
          status: { $nin: ["Live", "Delivered"] },
        },
      },
      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$status", "Awaiting Detail Confirmation"] },
                  then: 1,
                },
                {
                  case: { $eq: ["$status", "Awaiting Pickup"] },
                  then: 2,
                },
                {
                  case: { $eq: ["$status", "In Transit"] },
                  then: 3,
                },
                {
                  case: { $eq: ["$status", "Awaiting Transport Details"] },
                  then: 4,
                },
              ],
              default: 99,
            },
          },
        },
      },
      {
        $sort: {
          statusPriority: 1,
          updatedAt: -1,
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
      { $unwind: "$selectedTransporter" },
      {
        $project: {
          _id: 1,
          bidNo: 1,
          from: 1,
          to: 1,
          startDate: 1,
          endDate: 1,
          load: 1,
          status: 1,
          finalPrice: 1,
          selectedTransporter: {
            name: 1,
            email: 1,
            phNo: 1,
          },
        },
      },
    ]);

    return res.status(200).json({ success: true, inProgressBids });
  } catch (err) {
    next(err);
  }
};

exports.getBidDetails = async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.bidId, {
      bidNo: 1,
      from: 1,
      to: 1,
      startDate: 1,
      endDate: 1,
      load: 1,
      status: 1,
      transportDetails: 1,
      client: 1,
    });

    if (!bid) throw createNewError("No such bid!", 404);

    if (bid.client.toString() !== req.user._id.toString())
      throw createNewError("Not authorised!", 401);

    return res.status(200).json({
      success: true,
      bid,
    });
  } catch (err) {
    next(err);
  }
};

exports.confirmDetails = async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) throw createNewError("No such bid!", 404);
    if (bid.client.toString() != req.user._id.toString())
      throw createNewError("Not authorised!", 401);
    if (bid.status !== "Awaiting Detail Confirmation")
      throw createNewError("Cannot perform action!", 403);

    const updatedBid = await Bid.findByIdAndUpdate(
      bid._id,
      {
        status: "Awaiting Pickup",
      },
      { new: true }
    ).populate([
      { path: "client", select: "phNo" },
      { path: "selectedTransporter", select: "name email phNo" },
    ]);

    const OTP = crypto.randomInt(1000, 10000);

    await ConfirmationOTP.insertOne({
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

    await addDriverLinkJob(
      updatedBid.transportDetails.driverPhNo,
      updatedBid.bidNo,
      link
    );

    return res.status(200).json({ success: true, bid: updatedBid });
  } catch (err) {
    next(err);
  }
};

exports.getExpiredBids = async (req, res, next) => {
  try {
    const expiredBids = await Bid.aggregate([
      {
        $match: {
          client: new Types.ObjectId(req.user._id),
          status: "Live",
          expiresAt: { $lte: new Date() },
        },
      },
      { $sort: { expiresAt: -1 } },
      {
        $project: {
          _id: 1,
          bidNo: 1,
          from: 1,
          to: 1,
          startDate: 1,
          endDate: 1,
          load: 1,
          status: 1,
          expiresAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      expiredBids,
    });
  } catch (err) {
    next(err);
  }
};
