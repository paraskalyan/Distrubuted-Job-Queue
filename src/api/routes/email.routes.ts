import express from 'express';
import { getMetrics, jobController } from '../controllers/email.controller.js';

const router = express.Router();

router.post('/', jobController);
router.get('/metrics', getMetrics)

export default router;