const { Types } = require("mongoose");

const Bid = require("../../model/bid");
const Quote = require("../../model/quote");
const createNewError = require("../../util/createNewError");
const { getIO } = require("../../config/socket");
const bidInvitation = require("../../model/bidInvitation");

exports.postQuote = async (req, res, next) => {
  try {
    const { quotedPrice } = req.body;
    const bidNo = req.params.bidNo;

    const bid = await Bid.findOne({ bidNo });
    if (!bid) throw createNewError("No such bid", 404);
    if (bid.expiresAt <= new Date()) {
      throw createNewError("Bidding has closed for this bid", 410);
    }

    const bidId = bid._id;
    const bidInvite = await bidInvitation.findOne({ bid: bidId });
    const transporterId = req.user._id;

    if (!bidInvite) throw createNewError("Not authorised!", 401);
    if (
      !bidInvite.allowedTransporters.some(
        (id) => id.toString() === transporterId.toString()
      )
    ) {
      throw createNewError("Not authorised!", 401);
    }

    const existingQuote = await Quote.findOne({
      bidNo,
      transporter: transporterId,
    });

    if (existingQuote)
      throw createNewError("Cannot make multiple quotes!", 409);

    const quote = await Quote.create({
      quotedPrice,
      bidNo,
      transporter: new Types.ObjectId(transporterId),
    });

    const populatedQuote = await quote.populate(
      "transporter",
      "name email phNo"
    );

    const io = getIO();
    io.to(transporterId.toString()).emit("quote-submitted", { bidNo });
    io.to(bid.client._id.toString()).emit("new-quote", populatedQuote);

    const quoteCount = await Quote.countDocuments({ bidNo });

    if (quoteCount >= 5) {
      await bidInvitation.deleteOne({ bid: bidId });
    } else
      await bidInvitation.updateOne(
        { bid: bidId },
        { $pull: { allowedTransporters: transporterId } }
      );

    return res.status(200).json({
      success: true,
      message: "Quote successfully registered!",
    });
  } catch (err) {
    next(err);
  }
};
