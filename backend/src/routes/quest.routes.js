import express from 'express';
import { submitQuestAnswer, getQuests } from '../controllers/quest.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect routes: only authenticated users
router.get('/', protect, getQuests);
router.post('/:id/submit', protect, submitQuestAnswer);

export default router;
