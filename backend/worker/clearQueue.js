const { Queue } = require("bullmq");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const connection = {
  host: "127.0.0.1",
  port: 6379,
};

async function clearQueue() {
  const queue = new Queue("driver-link-job", { connection });

  await queue.drain(true);
  await queue.clean(0, 1000, "completed");
  await queue.clean(0, 1000, "failed");

  console.log("[QUEUE] cleared");
  process.exit(0);
}

clearQueue();
