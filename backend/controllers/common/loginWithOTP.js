const createNewError = require("../../util/createNewError");
const jwt = require("jsonwebtoken");
const redisClient = require("../../config/redis");

module.exports = async function loginWithOTP({
  req,
  res,
  next,
  Model,
  maxOTPAttempts,
}) {
  if (req.user != null) {
    throw createNewError("Already logged in!", 409);
  }

  try {
    const { phNo, OTP } = req.body;

    const user = await Model.findOne({ phNo });
    if (!user) {
      throw createNewError("Phone number not registered", 404);
    }

    const isBlockedKey = `isAccountBlocked:${phNo}`;
    const attemptsKey = `OTPattempts:${phNo}`;

    if (await redisClient.get(isBlockedKey)) {
      throw createNewError("Account temporarily blocked", 429);
    }

    const actualOTP = await redisClient.get(`OTP:${phNo}`);

    if (!actualOTP || actualOTP !== OTP) {
      const attempts = await redisClient.incr(attemptsKey);

      if (attempts === 1) {
        await redisClient.expire(attemptsKey, 600);
      }

      if (attempts >= maxOTPAttempts) {
        await redisClient.setEx(isBlockedKey, 15 * 60, "true");
        await redisClient.del(attemptsKey);
      }

      throw createNewError("Invalid OTP!", 401);
    }

    await redisClient.del(attemptsKey);

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phNo: user.phNo,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in!",
      user: payload,
    });
  } catch (err) {
    next(err);
  }
};
