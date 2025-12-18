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
  console.log("account sid is", accountSid);
  console.log("account auth is", authToken);
  console.log("twilio phone number", twilioPhoneNumber);
  const { OTP, phNo, driverPhNo, bidNo } = job.data;
  console.log("from worker", OTP, phNo);
  try {
    await client.messages.create({
      body: `Give this code on receiving delivery for bid ${bidNo} : ${OTP}. Driver's phone number : ${driverPhNo}`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const OTPDeliveryConfirmationWorker = new Worker(
  "OTPDeliveryConfirmation-queue",
  OTPDeliveryConfirmationJob,
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
