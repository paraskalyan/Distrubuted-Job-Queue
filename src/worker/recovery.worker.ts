import redis from "../lib/redis.js";

const VISIBILITY_TIMEOUT = 30 * 1000;

export const recoveryWorker = async () => {
  while (true) {
    try {
      // get all jobs from processing queue
      const jobs = await redis.lrange("emailQueue:processing", 0, -1);

      for (const rawJob of jobs) {
        const parsedJob = JSON.parse(rawJob);

        const now = Date.now();

        const processingTime = now - parsedJob.processingStartedAt;

        const isStale = processingTime > VISIBILITY_TIMEOUT;

        if (isStale) {
          console.log(`Recovering stale job: ${parsedJob.id}`);
          await redis.lrem("emailQueue:processing", 1, rawJob);
          parsedJob.processingStartedAt = null;
          await redis.lpush("emailQueue:pending", JSON.stringify(parsedJob));
        }
      }
    } catch (error) {
      console.error("Recovery worker error:", error);
    }
    await sleep(5000);
  }
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
