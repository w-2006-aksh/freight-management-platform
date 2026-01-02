const { Queue } = require("bullmq");

const OTPQueue = new Queue("OTP-login-queue");

async function addOTPJob(phNo, OTP) {
  await OTPQueue.add("send-OTP", { phNo, OTP });
  console.log("[QUEUE] OTP-login job enqueued");
}

module.exports = { OTPQueue, addOTPJob };
