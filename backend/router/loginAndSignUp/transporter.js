const express = require("express");
const router = express.Router();

const transporterController = require("../../controllers/transporter");

const formDataValidator = require("../../middleware/formDataValidator");

const transporterSignUpSchema = require("../../formDataValidate/transporter/signUp");

const requestOTPSchema = require("../../formDataValidate/login/requestOTP");

const validateOTPLoginSchema = require("../../formDataValidate/login/OTPLogin");

const PasswordLoginSchema = require("../../formDataValidate/login/PasswordLogin");

router.post(
  "/signup",
  formDataValidator(transporterSignUpSchema),
  transporterController.signUp
);

router.post(
  "/login/OTP",
  formDataValidator(validateOTPLoginSchema),
  transporterController.loginWithOTP
);

router.post(
  "/login/password",
  formDataValidator(PasswordLoginSchema),
  transporterController.loginWithPassword
);

router.post(
  "/login/request-OTP",
  formDataValidator(requestOTPSchema),
  transporterController.requestOTP
);

module.exports = router;
