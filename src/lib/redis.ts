import { Redis } from "ioredis";

const redisUrl = "redis://127.0.0.1:6379";
const redis = new Redis(redisUrl);

redis.on("connect", () => console.log("Redis connection successful"));
redis.on("error", (error) => console.log("Redis connection error: ", error));

export default redis;
