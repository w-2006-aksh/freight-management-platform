require("dotenv").config();
const { Worker } = require("bullmq");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID.trim();
const authToken = process.env.TWILIO_AUTH_TOKEN.trim();
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const bidWinnerNotificationProcessor = async (job) => {
  const { bidNo, phNo } = job.data;
  try {
    await client.messages.create({
      body: `Congratulations on winning bid ${bidNo}. Please upload documents on the portal!`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const bidWinnerNotificationWorker = new Worker(
  "bid-winner-notification",
  bidWinnerNotificationProcessor,
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
