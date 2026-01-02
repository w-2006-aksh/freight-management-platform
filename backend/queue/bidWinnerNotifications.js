const { Queue } = require("bullmq");

const bidWinnerNotificationQueue = new Queue("bid-winner-notification");

async function addBidWinnerNotificationJob(bidNo, phNo) {
  await bidWinnerNotificationQueue.add("notify-bid-winner", {
    bidNo,
    phNo,
  });

  console.log("[QUEUE] bid-winner-notification enqueued bidNo=%s", bidNo);
}

module.exports = { bidWinnerNotificationQueue, addBidWinnerNotificationJob };
