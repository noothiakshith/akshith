import prisma from '../utils/prisma.js';

/**
 * Checks and updates a user's daily streak.
 * Call this after a successful learning activity.
 * @param {number} userId
 * @returns {Promise<{updated: boolean, streak: number}>}
 */
export const updateStreak = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, lastActiveDate: true },
  });

  if (!user) throw new Error('User not found for streak update.');

  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  if (!user.lastActiveDate) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { streak: 1, lastActiveDate: new Date() },
    });
    return { updated: true, streak: updatedUser.streak };
  }

  const lastActive = new Date(user.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const diffTime = today - lastActive;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { updated: false, streak: user.streak };
  if (diffDays === 1) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { streak: { increment: 1 }, lastActiveDate: new Date() },
    });
    return { updated: true, streak: updatedUser.streak };
  }
  if (diffDays > 1) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { streak: 1, lastActiveDate: new Date() },
    });
    return { updated: true, streak: updatedUser.streak };
  }

  return { updated: false, streak: user.streak };
};
