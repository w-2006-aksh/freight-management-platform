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
  const { OTP, phNo } = job.data;

  try {
    await client.messages.create({
      body: `Your verification code is ${OTP}`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });

    console.log("[JOB_OK] OTP-login jobId=%s", job.id);
  } catch (err) {
    console.error("[JOB_FAIL] OTP-login jobId=%s err=%s", job.id, err.message);
    throw err;
  }
};

const OTPWorker = new Worker("OTP-login-queue", OTPJobProcessor, {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
