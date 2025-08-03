const { Queue } = require("bullmq");
const Transporter = require("../models/transporter");
const newBidBroadcastQueue = new Queue("new-bid-broadcast");

async function NewBidBroadcastJob(bidNo) {
  const transporters = await Transporter.find({});
  const jobs = [];
  transporters.forEach((transporter) => {
    const job = {
      name: "broadcast-new-bid",
      data: { bidNo, phNo: transporter.phNo },
    };

    jobs.push(job);
  });
  if (jobs.length > 0) await newBidBroadcastQueue.addBulk(jobs);
}

module.exports = { newBidBroadcastQueue, NewBidBroadcastJob };
