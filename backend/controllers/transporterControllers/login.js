const jwt = require("jsonwebtoken");
const Transporter = require("../../models/transporter");
const createNewError = require("../../util/createNewError");

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const transporter = await Transporter.findOne({ email });
    if (!transporter) {
      return next(createNewError("Email not registered", 404));
    }

    const isMatch = await transporter.ComparePassword(password);

    if (!isMatch) {
      return next(createNewError("Incorrect Password", 401));
    }

    const token = jwt.sign(
      {
        email,
        name: transporter.name,
        _id: transporter._id,
        role: transporter.role,
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
        name: transporter.name,
        role: "transporter",
        _id: transporter._id,
        email: transporter.email,
      },
    });
  } catch (error) {
    return next(createNewError("Server Error", 500));
  }
};

module.exports = { handleLogin };
