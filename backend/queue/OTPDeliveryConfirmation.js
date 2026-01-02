const { Queue } = require("bullmq");

const OTPDeliveryConfirmationQueue = new Queue(
  "OTP-delivery-confirmation-queue"
);

async function addOTPDeliveryConfirmation(OTP, phNo, driverPhNo, bidNo) {
  await OTPDeliveryConfirmationQueue.add("send-OTP", {
    OTP,
    phNo,
    driverPhNo,
    bidNo,
  });

  console.log("[QUEUE] OTP-delivery-confirmation job enqueued");
}

module.exports = { OTPDeliveryConfirmationQueue, addOTPDeliveryConfirmation };
