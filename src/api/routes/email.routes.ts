import express from 'express';
import { jobController } from '../controllers/email.controller.js';

const router = express.Router();

router.post('/jobs', jobController);

export default router;