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

const confirmationOTPCollection = mongoose.model(
  "confirmationOTP",
  confirmationOTPSchema
);

module.exports = confirmationOTPCollection;
