const Client = require("../../model/client");
const Transporter = require("../../model/transporter");
const createNewError = require("../../util/createNewError");
const { maxTrustedTransporters } = require("../../config/limits.js");
exports.updateTrustedTransporters = async (req, res, next) => {
  try {
    const { trustedTransporters } = req.body;

    if (trustedTransporters.length > maxTrustedTransporters) {
      throw createNewError(
        `Max ${maxTrustedTransporters} trusted transporters allowed`,
        400
      );
    }

    await Client.updateOne(
      { _id: req.user._id },
      { $set: { trustedTransporters } }
    );

    return res.status(200).json({
      success: true,
      message: "Trusted transporters updated",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTransporters = async (req, res, next) => {
  try {
    const client = await Client.findById(req.user._id).select(
      "trustedTransporters"
    );

    if (!client) throw createNewError("Client not found", 404);

    const transporters = await Transporter.find(
      {},
      { name: 1, phNo: 1, email: 1 }
    );

    const trustedSet = new Set(
      client.trustedTransporters.map((id) => id.toString())
    );

    const result = transporters.map((transporter) => ({
      _id: transporter._id,
      name: transporter.name,
      phNo: transporter.phNo,
      email: transporter.email,
      isTrusted: trustedSet.has(transporter._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      transporters: result,
    });
  } catch (err) {
    next(err);
  }
};
