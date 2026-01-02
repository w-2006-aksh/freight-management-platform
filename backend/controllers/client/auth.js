const Client = require("../../model/client");

const requestOTP = require("../common/requestOTP");
const loginWithOTP = require("../common/loginWithOTP");
const loginWithPassword = require("../common/loginWithPassword");
const checkExistingAccount = require("../common/checkExistingAccount");
const {
  maxClientOTPAttempts,
  maxClientPasswordAttempts,
} = require("../../config/limits.js");

exports.requestOTP = requestOTP;

exports.loginWithOTP = (req, res, next) =>
  loginWithOTP({
    req,
    res,
    next,
    Model: Client,
    maxOTPAttempts: maxClientOTPAttempts,
  });

exports.loginWithPassword = (req, res, next) =>
  loginWithPassword({
    req,
    res,
    next,
    Model: Client,
    maxPasswordAttempts: maxClientPasswordAttempts,
  });

exports.signUp = async (req, res, next) => {
  const { password, address, phNo, email, name } = req.body;

  try {
    await checkExistingAccount({
      Model: Client,
      query: { $or: [{ email }, { phNo }] },
    });

    await Client.create({
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
  } catch (err) {
    next(err);
  }
};
