import express from 'express';
import { submitQuestAnswer } from '../controllers/quest.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect route: only authenticated users
router.post('/:id/submit', protect, submitQuestAnswer);

export default router;
