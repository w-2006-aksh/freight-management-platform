const mongoose = require("mongoose");
const bidInvitationSchema = new mongoose.Schema(
  {
    bid: { type: mongoose.Schema.Types.ObjectId, ref: "bid", required: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    allowedTransporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transporter",
      },
    ],
  },
  { timestamps: true }
);

const bidInvitation = mongoose.model("bidInvitation", bidInvitationSchema);

module.exports = bidInvitation;
