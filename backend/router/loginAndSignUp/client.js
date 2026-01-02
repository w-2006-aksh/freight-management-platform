const express = require("express");
const router = express.Router();

const clientController = require("../../controllers/client");

const formDataValidator = require("../../middleware/formDataValidator");

const clientSignUpSchema = require("../../formDataValidate/client/signUp");

const requestOTPSchema = require("../../formDataValidate/login/requestOTP");

const OTPLoginSchema = require("../../formDataValidate/login/OTPLogin");

const PasswordLoginSchema = require("../../formDataValidate/login/PasswordLogin");

router.post(
  "/signup",
  formDataValidator(clientSignUpSchema),
  clientController.signUp
);

router.post(
  "/login/request-OTP",
  formDataValidator(requestOTPSchema),
  clientController.requestOTP
);

router.post(
  "/login/OTP",
  formDataValidator(OTPLoginSchema),
  clientController.loginWithOTP
);

router.post(
  "/login/password",
  formDataValidator(PasswordLoginSchema),
  clientController.loginWithPassword
);

module.exports = router;
