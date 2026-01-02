const { Queue } = require("bullmq");

const OTPQueue = new Queue("OTP-login-queue");

async function addOTPJob(phNo, OTP) {
  console.log("AddOTPJob received : ", OTP, phNo);
  await OTPQueue.add("send-OTP", { phNo, OTP });
}

module.exports = { OTPQueue, addOTPJob };
