// src/controllers/flashcard.controller.js
import { fetchReviewCards, processCardReview } from '../services/srs.service.js';

const getReviewFlashcards = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewCards = await fetchReviewCards(userId);
    res.status(200).json(reviewCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch review flashcards.' });
  }
};

const submitFlashcardReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const flashcardId = parseInt(req.params.id);
    const { quality } = req.body;

    if (quality === undefined || quality < 0 || quality > 5) {
      return res.status(400).json({ error: 'A valid "quality" rating (0-5) is required.' });
    }

    const updatedCard = await processCardReview({ userId, flashcardId, quality });
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export { getReviewFlashcards, submitFlashcardReview };
