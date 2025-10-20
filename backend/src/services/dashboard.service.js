
import prisma from '../utils/prisma.js';
/**
 * Fetch all aggregated data for the user's dashboard
 * @param {number} userId
 */
const fetchDashboardData = async (userId) => {
  const [
    userStats,
    lessonsCompletedCount,
    upcomingReviewsCount,
    recentMistakes
  ] = await prisma.$transaction([
    // 1. Core user stats
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        xp: true,
        coins: true,
        streak: true,
        name: true,
        email: true,
      },
    }),

    // 2. Progress summary (lessons completed)
    prisma.progress.count({
      where: { userId, completed: true },
    }),

    // 3. Flashcards due for review
    prisma.flashcard.count({
      where: {
        userId,
        nextReview: { lte: new Date() }, // Review due today or earlier
      },
    }),

    // 4. Last 5 mistakes
    prisma.mistake.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        userAnswer: true,
        correctAnswer: true,
        quest: { select: { question: true } },
      },
    }),
  ]);

  // 5. Total lessons available
  const totalLessons = await prisma.lesson.count();

  return {
    userStats,
    progressSummary: {
      lessonsCompleted: lessonsCompletedCount,
      totalLessons,
    },
    reviews: {
      upcomingCount: upcomingReviewsCount,
    },
    recentMistakes,
  };
};

export { fetchDashboardData };
