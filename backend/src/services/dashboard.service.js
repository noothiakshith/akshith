
import prisma from '../utils/prisma.js';
/**
 * Fetch all aggregated data for the user's dashboard
 * @param {number} userId
 */
const fetchDashboardData = async (userId) => {
  try {
    const [
      userStats,
      lessonsCompletedCount,
      upcomingReviewsCount,
      recentMistakes,
      totalLessons,
      userAchievements
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
          level: true,
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
          createdAt: true,
          quest: { select: { question: true } },
        },
      }),

      // 5. Total lessons available
      prisma.lesson.count(),

      // 6. User achievements
      prisma.userAchievement.count({
        where: { userId }
      })
    ]);

    // Create recent activity from progress and mistakes
    const recentActivity = [];
    
    // Add recent progress
    const recentProgress = await prisma.progress.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: 'desc' },
      take: 3,
      include: {
        lesson: {
          select: { title: true }
        }
      }
    });

    recentProgress.forEach(progress => {
      recentActivity.push({
        title: `Completed ${progress.lesson.title}`,
        description: `Earned ${progress.xpEarned} XP with ${Math.round(progress.accuracy)}% accuracy`,
        time: progress.completedAt ? new Date(progress.completedAt).toLocaleDateString() : 'Recently'
      });
    });

    // Add recent mistakes (learning opportunities)
    recentMistakes.slice(0, 2).forEach(mistake => {
      recentActivity.push({
        title: 'Learning Opportunity',
        description: `Reviewed: ${mistake.quest.question}`,
        time: new Date(mistake.createdAt).toLocaleDateString()
      });
    });

    return {
      completedLessons: lessonsCompletedCount,
      totalLessons,
      upcomingReviews: upcomingReviewsCount,
      totalAchievements: userAchievements,
      recentActivity: recentActivity.slice(0, 5), // Limit to 5 items
      stats: {
        xp: userStats?.xp || 0,
        coins: userStats?.coins || 0,
        streak: userStats?.streak || 0,
        lessonsCompleted: lessonsCompletedCount,
        accuracy: lessonsCompletedCount > 0 ? 85 : 0 // Placeholder calculation
      }
    };
  } catch (error) {
    console.error('Error in fetchDashboardData:', error);
    // Return default data structure if there's an error
    return {
      completedLessons: 0,
      totalLessons: 0,
      upcomingReviews: 0,
      totalAchievements: 0,
      recentActivity: [],
      stats: {
        xp: 0,
        coins: 0,
        streak: 0,
        lessonsCompleted: 0,
        accuracy: 0
      }
    };
  }
};

export { fetchDashboardData };
