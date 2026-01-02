const mongoose = require("mongoose");
const confirmationOTPSchema = new mongoose.Schema(
  {
    bidNo: {
      type: Number,
      ref: "Bid",
      required: true,
    },

    OTP: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ConfirmationOTP = mongoose.model(
  "confirmationOTP",
  confirmationOTPSchema
);

module.exports = ConfirmationOTP;
