const { createClient } = require("redis");

const redisClient = createClient();

redisClient.connect().then(() => console.log("connceted to redis"));

module.exports = redisClient;
