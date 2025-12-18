const { handleSignUp } = require("../../controllers/clientControllers/signUp");
const { handleLogin } = require("../../controllers/clientControllers/login");
const formDataValidator = require("../../middleware/formDataValidator");
const { clientSignUpSchema } = require("../../formDataValidate/client/signUp");
const createNewError = require("../../util/createNewError");
const express = require("express");
const router = express.Router();
const redisClient = require("../../config/redis");
const { addOtpJob } = require("../../queue/otpQueue");
const crypto = require("crypto");
const {
  requestOtpSchema,
} = require("../../formDataValidate/loginSchemas/requestOtpSchema");
const {
  validateOTPLoginSchema,
} = require("../../formDataValidate/loginSchemas/OTPLoginSchema");
const {
  validatePasswordLoginSchema,
} = require("../../formDataValidate/loginSchemas/PasswordLoginSchema");
const jwt = require("jsonwebtoken");
const Client = require("../../models/client");
const maxPasswordAttempts = 5;
const maxOTPAttempts = 5;
router.post(
  "/login/otp",
  formDataValidator(validateOTPLoginSchema),
  async (req, res, next) => {
    if (req.user != null) {
      return next(createNewError("Already logged in!", 409));
    }
    const { OTP, phNo } = req.body;

    try {
      const client = await Client.findOne({ phNo });
      if (!client) {
        return next(createNewError("Phone number not registered", 404));
      }
      const isBlockedKey = `isAccountBlocked:${phNo}`;
      const isBlocked = await redisClient.get(isBlockedKey);
      const attemptsKey = `OTPattempts:${phNo}`;
      if (isBlocked) {
        return next(createNewError("Account temporarily blocked", 429));
      }

      const actualOTP = await redisClient.get(`OTP:${phNo}`);
      if (!actualOTP || actualOTP !== OTP) {
        const attempts = await redisClient.incr(attemptsKey);
        if (attempts == 1) {
          await redisClient.expire(attemptsKey, 600);
        }
        if (attempts >= maxOTPAttempts) {
          await redisClient.setEx(isBlockedKey, 15 * 60, "true");
          await redisClient.del(attemptsKey);
        }
        return next(createNewError("Invalid OTP!", 401));
      }

      await redisClient.del(attemptsKey);
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
        secure: false,
      });

      return res.status(200).json({
        success: true,
        message: "Logged in!",
        user: payload,
      });
    } catch (error) {
      return next(createNewError("Server Error", 500));
    }
  }
);

router.post(
  "/login/password",
  formDataValidator(validatePasswordLoginSchema),
  async (req, res, next) => {
    if (req.user != null) {
      return next(createNewError("Already logged in!", 409));
    }
    try {
      const { password, phNo } = req.body;
      const client = await Client.findOne({ phNo });
      if (!client) {
        return next(createNewError("Phone number not registered", 404));
      }
      const isBlockedKey = `isAccountBlocked:${phNo}`;
      const isBlocked = await redisClient.get(isBlockedKey);
      const attemptsKey = `passwordAttempts:${phNo}`;
      if (isBlocked) {
        return next(createNewError("Account temporarily blocked", 429));
      }
      const isMatch = await client.ComparePassword(password);
      if (!isMatch) {
        const attempts = await redisClient.incr(attemptsKey);
        if (attempts == 1) {
          await redisClient.expire(attemptsKey, 10 * 60);
        }
        if (attempts >= maxPasswordAttempts) {
          await redisClient.setEx(isBlockedKey, 15 * 60, "true");
          await redisClient.del(attemptsKey);
        }
        return next(createNewError("Incorrect Password", 401));
      }

      await redisClient.del(attemptsKey);

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
        secure: false,
      });

      return res.status(200).json({
        success: true,
        message: "Logged in!",
        user: payload,
      });
    } catch (error) {
      return next(createNewError("Server Error", 500));
    }
  }
);

router.post("/signup", formDataValidator(clientSignUpSchema), handleSignUp);

router.post(
  "/login/request-OTP",
  formDataValidator(requestOtpSchema),
  async (req, res, next) => {
    if (req.user != null) {
      return next(createNewError("Already logged in!", 409));
    }
    try {
      const { phNo } = req.body;
      const rateLimit = 2;
      const timeWindow = 60;
      const otpCountkey = `otpCount:${phNo}`;
      const otpRequestedtillNow = await redisClient.incr(otpCountkey);
      if (otpRequestedtillNow > rateLimit) {
        return next(createNewError("Too many OTP requests!", 409));
      }
      if (otpRequestedtillNow == 1) {
        await redisClient.expire(otpCountkey, timeWindow);
      }
      const OTP = crypto.randomInt(1000, 10000);
      console.log("OTP generated is ", OTP);
      const otpKey = `OTP:${phNo}`;
      const otpExpiry = 300;
      await redisClient.set(otpKey, OTP, { EX: otpExpiry });
      await addOtpJob(phNo, OTP);
      return res.json({ success: true });
    } catch (error) {
      console.log(error);
      return next(createNewError("Internal server error", 500));
    }
  }
);

module.exports = router;
