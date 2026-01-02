const crypto = require("crypto");
const createNewError = require("../../util/createNewError");
const redisClient = require("../../config/redis");
const { addOTPJob } = require("../../queue/OTPLogin");
const {
  loginOTPRateLimit,
  loginOTPTimeWindow,
} = require("../../config/limits.js");
module.exports = async function requestOTP(req, res, next) {
  if (req.user != null) {
    throw createNewError("Already logged in!", 409);
  }

  try {
    const { phNo } = req.body;

    const OTPCountKey = `OTPCount:${phNo}`;
    const count = await redisClient.incr(OTPCountKey);

    if (count > loginOTPRateLimit) {
      throw createNewError("Too many OTP requests!", 429);
    }

    if (count === 1) {
      await redisClient.expire(OTPCountKey, loginOTPTimeWindow);
    }

    const OTP = crypto.randomInt(1000, 10000);
    const OTPKey = `OTP:${phNo}`;

    await redisClient.set(OTPKey, OTP, { EX: 300 });
    await addOTPJob(phNo, OTP);

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
