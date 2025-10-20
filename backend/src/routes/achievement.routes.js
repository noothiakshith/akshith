import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getUserAchievements } from '../controllers/achievement.controller.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserAchievements); // Fetch unlocked achievements

export default router;
