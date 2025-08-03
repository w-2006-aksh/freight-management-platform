const Client = require("../../models/client");
const jwt = require("jsonwebtoken");
const createNewError = require("../../util/createNewError");
const redisClient = require("../../config/redis");
const {
  validateOTPLoginSchema,
} = require("../../formDataValidate/loginSchemas/OTPLoginSchema");
const {
  validatePasswordLoginSchema,
} = require("../../formDataValidate/loginSchemas/PasswordLoginSchema");


const handleLogin = async (req, res, next) => {
  const { loginData, loginWithOTP } = req.body;
  const { phNo } = loginData;

  if (req.user != null) {
    return next(createNewError("Already logged in!", 409));
  }

  try {
    const client = await Client.findOne({ phNo });
    if (!client) {
      return next(createNewError("Phone number not registered", 404));
    }

    if (loginWithOTP) {
      const { OTP } = loginData;
      const actualOTP = await redisClient.get(`OTP:${phNo}`);
      if (!actualOTP) {
        return next(createNewError("OTP expired or already used!", 401));
      }
      if (actualOTP !== OTP) {
        return next(createNewError("Invalid OTP!", 401));
      }
      await redisClient.del(`OTP:${phNo}`);
    } else {
      const { password } = loginData;
      const isMatch = await client.ComparePassword(password);
      if (!isMatch) {
        return next(createNewError("Incorrect Password", 401));
      }
    }

    const payload = {
      email: client.email,
      phNo: client.phNo,
      name: client.name,
      _id: client._id,
      role: client.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: payload,
    });
  } catch (error) {
    return next(createNewError("Server Error", 500));
  }
};

module.exports = { handleLogin };


