require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { Worker } = require("bullmq");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const OTPJobProcessor = async (job) => {
  console.log("twilio phone number", twilioPhoneNumber);
  const { OTP, phNo } = job.data;
  console.log("from worker", OTP, phNo);
  try {
    await client.messages.create({
      body: `Your verification code is ${OTP}`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });
  } catch (err) {
    console.error("Twilio SMS failed", {
      jobId: job.id,
      OTP,
      phNo,
      error: err,
    });

    throw err;
  }
};

const OTPWorker = new Worker("OTP-login-queue", OTPJobProcessor, {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
