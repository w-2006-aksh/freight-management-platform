const Bid = require("../../model/bid");
const bidInvitation = require("../../model/bidInvitation");

const createNewError = require("../../util/createNewError");
const { Types } = require("mongoose");

exports.getLiveBids = async (req, res, next) => {
  try {
    const liveBids = await bidInvitation.aggregate([
      {
        $match: {
          allowedTransporters: new Types.ObjectId(req.user._id),
        },
      },

      {
        $lookup: {
          from: "bids",
          localField: "bid",
          foreignField: "_id",
          as: "bid",
        },
      },

      { $unwind: "$bid" },

      {
        $match: {
          "bid.status": "Live",
          "bid.expiresAt": { $gte: new Date() },
        },
      },

      { $sort: { "bid.createdAt": 1 } },

      { $limit: 10 },

      {
        $project: {
          _id: 1,
          bid: {
            _id: 1,
            bidNo: 1,
            from: 1,
            to: 1,
            startDate: 1,
            endDate: 1,
            load: 1,
            createdAt: 1,
            expiresAt: 1,
          },
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      liveBids,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyBids = async (req, res, next) => {
  try {
    const myBids = await Bid.aggregate([
      {
        $match: {
          selectedTransporter: new Types.ObjectId(req.user._id),
        },
      },
      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$status", "Awaiting Transport Details"] },
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
        $project: {
          _id: 1,
          bidNo: 1,
          from: 1,
          to: 1,
          status: 1,
          finalPrice: 1,
          load: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      myBids,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBidDetails = async (req, res, next) => {
  const bidNo = req.params.bidNo;

  try {
    const bid = await Bid.findOne({ bidNo });
    if (!bid) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true, bid });
  } catch (err) {
    next(err);
  }
};

exports.rejectBid = async (req, res, next) => {
  try {
    const bidId = req.params.bidId;
    const transporterId = req.user._id;

    const invite = await bidInvitation.findOneAndUpdate(
      { bid: bidId },
      { $pull: { allowedTransporters: transporterId } },
      { new: true }
    );

    if (invite && invite.allowedTransporters.length === 0) {
      await bidInvitation.deleteOne({ bid: bidId });
    }

    return res.status(200).json({
      success: true,
      message: "Bid rejected successfully",
    });
  } catch (err) {
    next(err);
  }
};
