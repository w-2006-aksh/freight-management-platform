const { Queue } = require("bullmq");

const driverLinkQueue = new Queue("driver-link-queue");

async function addDriverLinkJob(phNo, bidNo, token) {
  await driverLinkQueue.add("driver-link-job", {
    phNo,
    bidNo,
    token,
  });

  console.log("[QUEUE] driver-link job enqueued bidNo=%s", bidNo);
}

module.exports = { driverLinkQueue, addDriverLinkJob };
