import express from 'express';
import { startReviewQuiz, submitReviewAnswer } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all review routes
router.use(protect);

// Start a new review quiz
router.post('/start', startReviewQuiz);

// Submit an answer to a review quiz question
router.post('/submit', submitReviewAnswer);

export default router;
