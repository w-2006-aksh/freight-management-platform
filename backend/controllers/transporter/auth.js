const Transporter = require("../../model/transporter");

const requestOTP = require("../common/requestOTP");
const loginWithOTP = require("../common/loginWithOTP");
const loginWithPassword = require("../common/loginWithPassword");
const checkExistingAccount = require("../common/checkExistingAccount");
const {
  maxTransporterOTPAttempts,
  maxTransporterPasswordAttempts,
} = require("../../config/limits");
const createNewError = require("../../util/createNewError");

exports.requestOTP = requestOTP;

exports.loginWithOTP = (req, res, next) =>
  loginWithOTP({
    req,
    res,
    next,
    Model: Transporter,
    maxOTPAttempts: maxTransporterOTPAttempts,
  });

exports.loginWithPassword = (req, res, next) =>
  loginWithPassword({
    req,
    res,
    next,
    Model: Transporter,
    maxPasswordAttempts: maxTransporterPasswordAttempts,
  });

exports.signUp = async (req, res, next) => {
  const { password, address, gstNo, phNo, email, name } = req.body;

  try {
    await checkExistingAccount({
      Model: Transporter,
      query: { $or: [{ email }, { phNo }, { gstNo }] },
    });

    await Transporter.create({
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
  } catch (err) {
    next(err);
  }
};
