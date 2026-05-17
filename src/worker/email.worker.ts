import redis from "../lib/redis.js";

export const emailWorker = async () => {
  while (true) {
    let parsedJob = null;
    try {
      const job = await redis.brpoplpush(
        "emailQueue:pending",
        "emailQueue:processing",
        0,
      );
      console.log(job);
      if (job) {
        parsedJob = JSON.parse(job);
        parsedJob.processingStartedAt = Date.now();
        parsedJob.workerId = "worker-1";
        console.log(`Processing job: ${parsedJob.id}`);
        await sendEmail(parsedJob);
        await redis.lrem("emailQueue:processing", 1, JSON.stringify(job));
        console.log(`Processing job: ${parsedJob.id}`);
      }
    } catch (error) {
      if (parsedJob) {
        parsedJob.attempts++;
        if (parsedJob.attempts <= parsedJob.maxAttempts) {
          await redis.lpush("emailQueue:pending", JSON.stringify(parsedJob));
        } else {
          const data = {
            id: crypto.randomUUID(),
            attempts: parsedJob.attempts,
            maxAttempts: parsedJob.maxAttempts,
            failedAt: Date.now(),
            failureReason: error,
          };
          await redis.lpush("emailQueue:dlq", JSON.stringify(data));
        }
      }
    }
  }
};

const sendEmail = async (job: any) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(job);
      reject(true);
    }, 3000);
  });
};
