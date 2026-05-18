import redis from "../lib/redis.js";

const workerId = crypto.randomUUID();

export const emailWorker = async () => {
  startHeartbeat();
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
        parsedJob.workerId = workerId;
        console.log(`Processing job: ${parsedJob.id}`);
        await sendEmail(parsedJob);
        await redis.lrem("emailQueue:processing", 1, JSON.stringify(job));
        await redis.incr("metrics:completed");
      }
    } catch (error) {
      if (parsedJob) {
        await redis.incr("metrics:failed");
        console.error("Job failed:", error);
        if (!parsedJob) continue;

        await redis.lrem("emailQueue:processing", 1, JSON.stringify(parsedJob));

        parsedJob.attempts++;
        parsedJob.updatedAt = Date.now();
        parsedJob.lastFailureReason =
          error instanceof Error ? error.message : "Unknown error";

        if (parsedJob.attempts <= parsedJob.maxAttempts) {
          await redis.lpush("emailQueue:pending", JSON.stringify(parsedJob));
          await redis.incr("metrics:retried");
        } else {
          const data = {
            dlqId: crypto.randomUUID(),
            attempts: parsedJob.attempts,
            maxAttempts: parsedJob.maxAttempts,
            failedAt: Date.now(),
            failureReason:
              error instanceof Error ? error.message : "Unknown Error",
          };
          await redis.lpush("emailQueue:dlq", JSON.stringify(data));
          await redis.incr("metrics:dlq");

          console.log(`Job moved to DLQ: ${parsedJob.id}`);
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

const startHeartbeat = () => {
  setInterval(async () => {
    await redis.hset("workers:heartbeat", workerId, Date.now());
  }, 5000);
};
