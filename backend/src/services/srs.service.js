import prisma from '../utils/prisma.js';
// --- Configuration for the SRS Algorithm ---
const LEARNING_STEPS_MINUTES = [10, 1440]; // Step 1: 10 minutes, Step 2: 1 day (1440 mins)
const INITIAL_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;

// --- Helper Functions ---
const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);
const addDays = (date, days) => new Date(date.setDate(date.getDate() + days));

/**
 * Fetches all flashcards that are due for review for a given user.
 */
const fetchReviewCards = async (userId) => {
  return prisma.flashcard.findMany({
    where: {
      userId,
      nextReview: { lte: new Date() },
    },
    take: 20,
    orderBy: {
      difficulty: 'desc', // Prioritize new/learning cards over review cards
    },
  });
};

/**
 * Processes a user's review of a flashcard and calculates the next review date.
 * Implements a state-based algorithm with learning steps and lapse handling.
 * @param {object} options
 * @param {number} options.quality A user-provided rating (0-5)
 *        (quality < 3 is a failure, quality >= 3 is a success)
 */
const processCardReview = async ({ userId, flashcardId, quality }) => {
  const card = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
  });

  if (!card || card.userId !== userId) {
    throw new Error('Flashcard not found or access denied.');
  }

  const isSuccess = quality >= 3;
  let updatedData = {};

  switch (card.difficulty) {
    case 'new':
    case 'learning':
      if (isSuccess) {
        // --- Card is in Learning and was answered correctly ---
        const currentStepIndex = card.learningStep - 1;
        if (currentStepIndex < LEARNING_STEPS_MINUTES.length - 1) {
          // Advance to the next learning step
          updatedData = {
            difficulty: 'learning',
            learningStep: card.learningStep + 1,
            nextReview: addMinutes(new Date(), LEARNING_STEPS_MINUTES[currentStepIndex + 1]),
          };
        } else {
          // Graduate the card to "review"
          updatedData = {
            difficulty: 'review',
            interval: 1, // First interval is 1 day
            repetitions: 1,
            easeFactor: INITIAL_EASE_FACTOR,
            nextReview: addDays(new Date(), 1),
          };
        }
      } else {
        // --- Card is in Learning and was answered incorrectly ---
        // Reset to the first learning step
        updatedData = {
          learningStep: 1,
          repetitions: 0, // Reset repetitions on failure
          nextReview: addMinutes(new Date(), LEARNING_STEPS_MINUTES[0]),
        };
      }
      break;

    case 'review':
      if (isSuccess) {
        // --- Card is a Review card and was answered correctly ---
        let newInterval;
        if (card.repetitions === 0) {
            newInterval = 1;
        } else if (card.repetitions === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.ceil(card.interval * card.easeFactor);
        }

        const newEaseFactor = Math.max(MINIMUM_EASE_FACTOR, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
        
        updatedData = {
          interval: newInterval,
          repetitions: card.repetitions + 1,
          easeFactor: newEaseFactor,
          nextReview: addDays(new Date(), newInterval),
        };
      } else {
        // --- LAPSE: Card is a Review card and was answered incorrectly ---
        // Penalize ease factor and reset to learning phase
        updatedData = {
          difficulty: 'learning',
          learningStep: 1,
          repetitions: 0, // Reset progress
          easeFactor: Math.max(MINIMUM_EASE_FACTOR, card.easeFactor - 0.2),
          interval: 1,
          nextReview: addMinutes(new Date(), LEARNING_STEPS_MINUTES[0]),
        };
      }
      break;
  }

  // Update common fields and save to database
  return prisma.flashcard.update({
    where: { id: flashcardId },
    data: {
      ...updatedData,
      lastReviewed: new Date(),
      timesReviewed: { increment: 1 },
      timesCorrect: { increment: isSuccess ? 1 : 0 },
    },
  });
};

/**
 * Creates a new flashcard manually for a user.
 */
const createManualFlashcard = async ({ userId, front, back }) => {
    return prisma.flashcard.create({
        data: {
            userId,
            front,
            back,
            source: 'manual',
            difficulty: 'new', // All new cards start in the 'new' state
        }
    });
};

export { fetchReviewCards, processCardReview, createManualFlashcard };