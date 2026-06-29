// const { Queue } = require("bullmq");
// const Transporter = require("../model/transporter");

// const newBidBroadcastQueue = new Queue("new-bid-broadcast");

// async function newBidBroadcastJob(bidNo) {
//   const transporters = await Transporter.find({});
//   const jobs = [];

//   transporters.forEach((transporter) => {
//     jobs.push({
//       name: "broadcast-new-bid",
//       data: { bidNo, phNo: transporter.phNo },
//     });
//   });

//   if (jobs.length > 0) {
//     await newBidBroadcastQueue.addBulk(jobs);
//     console.log(
//       "[QUEUE] new-bid-broadcast enqueued bidNo=%s count=%d",
//       bidNo,
//       jobs.length
//     );
//   }
// }

// module.exports = { newBidBroadcastQueue, newBidBroadcastJob };
