require("dotenv").config();
const { Worker } = require("bullmq");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID.trim();
const authToken = process.env.TWILIO_AUTH_TOKEN.trim();
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const otpJobProcessor = async (job) => {
  console.log("account sid is", accountSid);
  console.log("account auth is", authToken);
  console.log("twilio phone number", twilioPhoneNumber);
  const { otp, phNo } = job.data;
  console.log("from worker", otp, phNo);
  try {
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const otpWorker = new Worker("otp-Queue", otpJobProcessor, {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
