import redis from "../lib/redis.js"

export const emailWorker = async () =>{
    try {
        while(true){
            const job = await redis.brpop("emailQueue", 0);
            console.log(job)
        }
    } catch (error) {
        
    }
}