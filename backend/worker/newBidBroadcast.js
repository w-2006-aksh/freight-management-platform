require("dotenv").config();
const { Worker } = require("bullmq");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const bidBroadcastProcessor = async (job) => {
  const { bidNo, phNo } = job.data;
  try {
    await client.messages.create({
      body: `Bid Number ${bidNo} is now live! Make a quote.`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });
  } catch (err) {
    console.error("Twilio SMS failed", {
      jobId: job.id,
      bidNo,
      phNo,
      error: err,
    });

    throw err;
  }
};

const newBidBroadcastWorker = new Worker(
  "new-bid-broadcast",
  bidBroadcastProcessor,
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
