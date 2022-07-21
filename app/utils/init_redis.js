const redisDB = require("redis");
const redisClient = redisDB.createClient({
   // url: 'redis://redis:6379'
});
redisClient.connect().then(() => console.log("connect to redis"));
redisClient.on("ready", () => console.log("connected to redis and ready to use..."));
redisClient.on("error", (err) => console.log("RedisError: ", err.message));
redisClient.on("end", () => console.log("disconnected from redis...."))

module.exports = redisClient