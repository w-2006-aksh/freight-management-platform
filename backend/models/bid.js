const mongoose = require("mongoose");

const transportDetailsSchema = new mongoose.Schema({
  driverName: { type: String },
  driverPhNo: { type: String },
  driverLicenseUrl: { type: String },
  vehicleNo: { type: String },
  vehicleDocumentUrl: { type: String },
});

const bidSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    bidNo: {
      type: Number,
      unique: true,
      required: true,
    },

    selectedTransporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transporter",
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    load: {
      type: Number,
      required: true,
    },

    commodity: {
      type: String,
      required: true,
    },

    importantForClient: {
      type: Boolean,
      default: false,
    },

    importantForTransporter: {
      type: Boolean,
      default: false,
    },

    live: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: [
        "Awaiting Pickup",
        "Live",
        "Delivered",
        "Awaiting Transport Details",
        "Awaiting Detail Confirmation",
        "In Transit",
      ],
      default: "Live",
    },

    finalPrice: {
      type: Number,
    },

    transportDetails: transportDetailsSchema,
    journey: [
      {
        city: String,
        lat: Number,
        lng: Number,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Bid = mongoose.model("bid", bidSchema);

module.exports = Bid;
