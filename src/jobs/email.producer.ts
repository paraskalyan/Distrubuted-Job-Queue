import redis from "../lib/redis.js";

export const emailProducer = async (payload: any) => {
  try {
    const data = {
      id: crypto.randomUUID(),
      type: "email",
      payload,
      attempts: 0,
      maxAttempts: 3,
      status: "PENDING",
    };

    await redis.lpush("emailQueue", JSON.stringify(data));

    console.log("Job added");
  } catch (error) {}
};
