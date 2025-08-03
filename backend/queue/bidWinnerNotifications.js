const { Queue } = require("bullmq");

const bidWinnerNotificationQueue = new Queue("bid-winner-notification");

async function addBidWinnerNotificationJob(bidNo, phNo) {
  await bidWinnerNotificationQueue.add("notify-bid-winner", {
    bidNo,
    phNo,
  });
}

module.exports = { bidWinnerNotificationQueue, addBidWinnerNotificationJob };
