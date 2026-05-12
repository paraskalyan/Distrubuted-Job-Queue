import redis from "../lib/redis.js";

export const emailWorker = async () => {
  while (true) {
    let parsedJob = null;
    try {
        console.log("control")
      const job = await redis.brpoplpush("emailQueue:pending", "emailQueue:processing", 0);
      console.log(job);
      console.log("control 2")
      if (job) {
        const [, data] = job;
        if(!data) return;
        parsedJob = JSON.parse(data);
        await sendEmail(parsedJob);
      }
    } catch (error) {
      if (parsedJob) {
        parsedJob.attempts++;
        if (parsedJob.attempts <= parsedJob.maxAttempts) {
          await redis.lpush("emailQueue", JSON.stringify(parsedJob));
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
