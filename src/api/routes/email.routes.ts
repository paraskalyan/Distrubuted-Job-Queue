import express from 'express';
import { jobController } from '../controllers/email.controller.js';

const router = express.Router();

router.post('/', jobController);

export default router;