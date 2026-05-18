import type { Request, Response } from "express"
import { emailProducer } from "../../jobs/email.producer.js"
import redis from "../../lib/redis.js";

export const jobController = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        await emailProducer(data);
        res.json({message: 'Job added'});
    } catch (error) {
        console.log(error);
    }
}

export const getMetrics = async (req: Request, res: Response) => {
    try {
        const completedJobs = await redis.llen("metrics:completed");
        const retriedJobs = await redis.llen("metrics:retried");
        const dlqJobs = await redis.llen("metrics:dlq");

        res.status(200).json({
            status: 'success',
            message: 'Successfully fetched metrics',
            data: {
                completedJobs,
                retriedJobs,
                dlqJobs
            }
        })
    } catch (error) {
        res.status(500).json({status: 'error', message: 'Some error occurred'})
    }
}