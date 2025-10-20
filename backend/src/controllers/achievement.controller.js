import prisma from '../utils/prisma.js';

export const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Could not fetch achievements.' });
  }
};