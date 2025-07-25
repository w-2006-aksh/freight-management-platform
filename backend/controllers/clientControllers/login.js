const Client = require("../../models/client");
const jwt = require("jsonwebtoken");
const createNewError = require("../../util/createNewError");

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return next(createNewError("Email not registered", 404));
    }

    const isMatch = await client.ComparePassword(password);
    if (!isMatch) {
      return next(createNewError("Incorrect Password", 401));
    }

    const token = jwt.sign(
      {
        email,
        name: client.name,
        _id: client._id,
        role: client.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in",
      user: {
        name: client.name,
        _id: client._id,
        email: client.email,
        role: client.role,
      },
    });
  } catch (error) {
    return next(createNewError("Server Error", 500));
  }
};

module.exports = { handleLogin };
