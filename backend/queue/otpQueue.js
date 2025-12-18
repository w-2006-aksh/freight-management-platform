const { Queue } = require("bullmq");

const otpQueue = new Queue("otp-Queue");

async function addOtpJob(phNo, otp) {
  console.log("AddOtpJob received : ", otp, phNo);
  await otpQueue.add("sendOtp", { phNo, otp });
}

module.exports = { otpQueue, addOtpJob };
