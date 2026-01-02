const { Queue } = require("bullmq");

const driverLinkQueue = new Queue("driver-link-queue");

async function addDriverLinkJob(phNo, bidNo, link) {
  await driverLinkQueue.add("driver-link-job", {
    phNo,
    bidNo,
    link,
  });
}

module.exports = { driverLinkQueue, addDriverLinkJob };
