require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const { Worker } = require("bullmq");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const driverLinkJobProcessor = async (job) => {
  const { phNo, bidNo, token } = job.data;
  const link = `http://172.20.10.3:8000/api/trip/open/${bidNo}?token=${encodeURIComponent(
    token
  )}`;
  try {
    await client.messages.create({
      body: `Link for bid ${bidNo} is: ${link}`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });

    console.log("[JOB_OK] driver-link-queue jobId=%s bidNo=%s", job.id, bidNo);
  } catch (err) {
    console.error(
      "[JOB_FAIL] driver-link-queue jobId=%s bidNo=%s err=%s",
      job.id,
      bidNo,
      err.message
    );
    throw err;
  }
};

const driverLinkWorker = new Worker(
  "driver-link-queue",
  driverLinkJobProcessor,
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
