import type { Request, Response } from "express"
import { emailProducer } from "../../jobs/email.producer.js"

export const jobController = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        await emailProducer(data);
        res.json({message: 'Job added'});
    } catch (error) {
        console.log(error);
    }
}