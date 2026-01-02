const Bid = require("../../model/bid");
const createNewError = require("../../util/createNewError");

exports.getJourney = async (req, res, next) => {
  try {
    const bidNo = Number(req.params.bidNo);

    const bid = await Bid.findOne({ bidNo });
    if (!bid) throw createNewError("No such bid", 404);

    if (bid.client.toString() !== req.user._id.toString())
      throw createNewError("Not authorised", 404);

    return res.status(200).json({
      success: true,
      status: bid.status,
      journey: bid.journey,
    });
  } catch (err) {
    next(err);
  }
};
