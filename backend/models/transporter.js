const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const transporterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phNo: {
      type: Number,
      required: true,
      unique: true,
    },

    gstNo: {
      type: Number,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "transporter",
    },
  },
  { timestamps: true }
);

transporterSchema.pre("save", function (next) {
  const Transporter = this;
  if (!Transporter.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(Transporter.password, salt);
  Transporter.password = hashedPassword;
  next();
});

transporterSchema.methods.ComparePassword = async function (Receivedpassword) {
  return await bcrypt.compare(Receivedpassword, this.password);
};

const Transporter = mongoose.model("Transporter", transporterSchema);

module.exports = Transporter;
