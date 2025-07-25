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

    important: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "Awaiting transport details",
        "Awaiting detail confirmation",
        "en route",
      ],
      default: "active",
    },

    finalPrice: {
      type: Number,
    },

    transportDetails: transportDetailsSchema,
  },
  { timestamps: true }
);

const Bid = mongoose.model("bid", bidSchema);

module.exports = Bid;
