require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { Worker } = require("bullmq");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const OTPDeliveryConfirmationJob = async (job) => {
  const { OTP, phNo, driverPhNo, bidNo } = job.data;
  try {
    await client.messages.create({
      body: `Give this code on receiving delivery for bid ${bidNo} : ${OTP}. Driver's phone number : ${driverPhNo}`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });
  } catch (err) {
    console.error("Twilio SMS failed", {
      jobId: job.id,
      bidNo,
      phNo,
      driverPhNo,
      OTP,
      error: err,
    });

    throw err;
  }
};

const OTPDeliveryConfirmationWorker = new Worker(
  "OTP-delivery-confirmation-queue",
  OTPDeliveryConfirmationJob,
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
