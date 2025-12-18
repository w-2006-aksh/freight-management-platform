const { Queue } = require("bullmq");

const driverLinkQueue = new Queue("driver-link-queue");

async function addDriverLinkJob(phNo, bidNo, link) {
  console.log("from driverLink job, phNo : ", phNo);
  await driverLinkQueue.add("driver-link-job", {
    phNo,
    bidNo,
    link,
  });
}

module.exports = { driverLinkQueue, addDriverLinkJob };
