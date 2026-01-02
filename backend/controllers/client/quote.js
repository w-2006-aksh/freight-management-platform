const Bid = require("../../model/bid");
const Quote = require("../../model/quote");
const createNewError = require("../../util/createNewError");

const {
  addBidWinnerNotificationJob,
} = require("../../queue/bidWinnerNotifications");

exports.getQuotes = async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.bidId, {
      bidNo: 1,
      from: 1,
      to: 1,
      startDate: 1,
      endDate: 1,
      load: 1,
      client: 1,
    });

    if (!bid) throw createNewError("Bid not found!", 404);

    if (bid.client.toString() !== req.user._id.toString())
      throw createNewError("Not authorised!", 401);

    const quotes = await Quote.find(
      { bidNo: bid.bidNo },
      {
        quotedPrice: 1,
        transporter: 1,
      }
    )
      .populate("transporter", "name email phNo")
      .sort({ quotedPrice: 1 });

    return res.status(200).json({
      success: true,
      bidDetails: bid,
      quotes,
    });
  } catch (err) {
    next(err);
  }
};

exports.acceptQuote = async (req, res, next) => {
  try {
    const { bidId } = req.params;
    const { transporter, quotedPrice } = req.body;

    const bid = await Bid.findById(bidId);

    if (!bid) throw createNewError("Bid not found!", 404);
    if (bid.client.toString() != req.user._id.toString())
      throw createNewError("Not authorised!", 401);

    if (bid.expiresAt <= new Date()) {
      throw createNewError("This bid has expired and cannot be accepted", 410);
    }

    if (bid.status !== "Live")
      throw createNewError("Quote already selected", 409);

    const updatedBid = await Bid.findByIdAndUpdate(
      bidId,
      {
        selectedTransporter: transporter._id,
        status: "Awaiting Transport Details",
        finalPrice: quotedPrice,
      },
      { new: true }
    ).populate("selectedTransporter", "phNo email name");


    await addBidWinnerNotificationJob(bid.bidNo, transporter.phNo);

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
