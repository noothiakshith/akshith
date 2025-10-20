import prisma from '../utils/prisma.js';

const QUIZ_LENGTH = 10; // Number of questions in a review quiz

/**
 * Generates a new review quiz session from a user's past mistakes.
 * @param {number} userId The user's ID.
 */
export const generateReviewQuiz = async (userId) => {
  const mistakes = await prisma.mistake.findMany({
    where: {
      userId,
      reviewed: false, // Focus on unreviewed mistakes
    },
    orderBy: {
      createdAt: 'asc', // Oldest mistakes first
    },
    take: QUIZ_LENGTH,
    include: {
      quest: true, // Include quest data
    },
  });

  if (mistakes.length === 0) {
    throw new Error("No mistakes available to review. Great job!");
  }

  return mistakes.map((mistake) => ({
    mistakeId: mistake.id, // needed by frontend to submit
    question: mistake.quest.question,
    type: mistake.quest.type,
    options: mistake.quest.options,
    // answer not sent to client
  }));
};

/**
 * Checks an answer for a quest within a review quiz.
 * @param {object} options
 * @param {number} options.userId
 * @param {number} options.mistakeId
 * @param {string} options.userAnswer
 */
export const checkReviewAnswer = async ({ userId, mistakeId, userAnswer }) => {
  const mistake = await prisma.mistake.findUnique({
    where: { id: mistakeId },
    include: { quest: true },
  });

  if (!mistake || mistake.userId !== userId) {
    throw new Error("Mistake not found or access denied.");
  }

  const isCorrect = mistake.correctAnswer.toLowerCase() === userAnswer.toLowerCase();

  if (isCorrect) {
    await prisma.$transaction([
      prisma.mistake.update({
        where: { id: mistakeId },
        data: { reviewed: true, reviewCount: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: 5 } }, // Bonus XP
      }),
    ]);
  } else {
    await prisma.mistake.update({
      where: { id: mistakeId },
      data: { reviewCount: { increment: 1 } },
    });
  }

  return {
    isCorrect,
    correctAnswer: mistake.correctAnswer,
  };
};
