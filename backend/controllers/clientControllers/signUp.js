const Client = require("../../models/client");
const createNewError = require("../../util/createNewError");

const handleSignUp = async (req, res, next) => {
  const { password, address, phNo, email, name } = req.body;

  try {
    const existingClient = await Client.findOne({
      $or: [{ email }, { phNo }],
    });

    if (existingClient) {
      return next(
        createNewError("Account with email or phone already exists", 409)
      );
    }

    const newClient = await Client.create({
      password,
      address,
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
