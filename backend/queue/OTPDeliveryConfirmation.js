const { Queue } = require("bullmq");

const OTPDeliveryConfirmationQueue = new Queue("OTPDeliveryConfirmation-queue");

async function addOTPDeliveryConfirmation(OTP, phNo, driverPhNo, bidNo) {
  console.log(OTP, phNo, driverPhNo, bidNo);
  await OTPDeliveryConfirmationQueue.add("sendOtp", {
    OTP,
    phNo,
    driverPhNo,
    bidNo,
  });
}

module.exports = { OTPDeliveryConfirmationQueue, addOTPDeliveryConfirmation };
