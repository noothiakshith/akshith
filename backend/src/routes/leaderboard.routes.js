import express from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected route: only logged-in users can access
router.get('/', protect, getLeaderboard);

export default router;
