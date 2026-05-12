import redis from "../lib/redis.js";

export const emailWorker = async () => {
  while (true) {
    let parsedJob = null;
    try {
      const job = await redis.brpop("emailQueue", 0);
      if (job) {
        const [, data] = job;
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
      resolve(true);
    }, 3000);
  });
};
