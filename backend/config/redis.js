const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("[REDIS_ERROR]", err.message);
});

redisClient.connect().then(() => console.log("[REDIS] connected"));

module.exports = redisClient;
