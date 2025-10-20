// src/routes/flashcard.routes.js
import express from 'express';
import { getReviewFlashcards, submitFlashcardReview } from '../controllers/flashcard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes protected
router.use(protect);

// GET /api/flashcards/review
router.get('/review', getReviewFlashcards);

// POST /api/flashcards/:id/review
router.post('/:id/review', submitFlashcardReview);

export default router;
