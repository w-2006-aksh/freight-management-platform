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
  console.log("JOB ID:", job.id);
  console.log("JOB DATA:", job.data);

  const { phNo, bidNo, link } = job.data;
  try {
    await client.messages.create({
      body: `Link for bid ${bidNo} is: ${link}`,
      from: twilioPhoneNumber,
      to: `+91${phNo}`,
    });
  } catch (error) {
    console.log(error);
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
