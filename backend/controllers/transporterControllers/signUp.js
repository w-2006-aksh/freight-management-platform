const Transporter = require("../../models/transporter");
const createNewError = require("../../util/createNewError");

const handleSignUp = async (req, res, next) => {
  const { password, address, gstNo, phNo, email, name } = req.body;


  try {
    const existingTransporter = await Transporter.findOne({
      $or: [{ email }, { phNo }, { gstNo }],
    });
    if (existingTransporter) {
      return next(
        createNewError(
          "Account with email/phone/gstNumber already exists.",
          409
        )
      );
    }

    const newTransporter = await Transporter.create({
      password,
      address,
      gstNo,
      phNo,
      email,
      name,
    });
    return res.status(200).json({
      success: true,
      message: "Sign Up successful. Proceed to log in",
    });
  } catch (error) {
    return next(createNewError("Server Error", 500));
  }
};

module.exports = { handleSignUp };
