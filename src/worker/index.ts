import { emailWorker } from "./email.worker.js";
const CONCURRENCY = 5;

for(let i = 0; i < CONCURRENCY; i++){
    emailWorker();
}
