import prisma from '../utils/prisma.js';

/**
 * Check and unlock achievements for a user
 * @param {number} userId 
 */
export const checkAchievements = async (userId) => {
  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Fetch all achievements
  const achievements = await prisma.achievement.findMany();

  for (const achievement of achievements) {
    // Skip if already unlocked
    const unlocked = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });
    if (unlocked) continue;

    const { type, value } = achievement.condition; // e.g., {type: "streak", value: 7}
    let achieved = false;

    // Check achievement condition
    if (type === 'streak' && user.streak >= value) achieved = true;
    if (type === 'xp' && user.xp >= value) achieved = true;
    if (type === 'completion') {
      const completedLessons = await prisma.progress.count({
        where: { userId, completed: true },
      });
      achieved = completedLessons >= value;
    }

    // Unlock achievement if condition met
    if (achieved) {
      await prisma.$transaction([
        prisma.userAchievement.create({
          data: { userId, achievementId: achievement.id },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { coins: { increment: achievement.coinReward } },
        }),
      ]);
    }
  }
};
