const Transporter = require("../../models/transporter");
const jwt = require("jsonwebtoken");
const createNewError = require("../../util/createNewError");
const redisClient = require("../../config/redis"); // Added Redis import

const handleLogin = async (req, res, next) => {
  const { loginData, loginWithOTP } = req.body;
  const { phNo } = loginData;
  console.log("req rec");
  try {
    const transporter = await Transporter.findOne({ phNo });
    if (!transporter) {
      return next(createNewError("Phone number not registered", 404));
    }

    if (!loginWithOTP) {
      const { password } = loginData;
      const isMatch = await transporter.ComparePassword(password);
      if (!isMatch) {
        return next(createNewError("Incorrect Password", 401));
      }
    } else {
      const { OTP } = loginData;
      const actualOTP = await redisClient.get(`OTP:${phNo}`);

      if (!actualOTP) {
        return next(createNewError("OTP expired!", 401));
      }
      if (actualOTP != OTP) {
        return next(createNewError("Invalid OTP!", 401));
      }
      await redisClient.del(`OTP:${phNo}`);
    }
    const token = jwt.sign(
      {
        email: transporter.email,
        phNo,
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
        phNo,
        name: transporter.name,
        _id: transporter._id,
        email: transporter.email,
        role: transporter.role,
      },
    });
  } catch (error) {
    return next(createNewError("Server Error", 500));
  }
};

module.exports = { handleLogin };
