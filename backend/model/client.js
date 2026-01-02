const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const clientSchema = new mongoose.Schema(
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
      default: "client",
    },
    
    trustedTransporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transporter",
      },
    ],
  },
  { timestamps: true }
);

clientSchema.pre("save", function (next) {
  const Client = this;
  if (!Client.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(Client.password, salt);
  Client.password = hashedPassword;
  next();
});

clientSchema.methods.ComparePassword = async function (Receivedpassword) {
  return await bcrypt.compare(Receivedpassword, this.password);
};

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
