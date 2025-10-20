import prisma from '../utils/prisma.js';

/**
 * GET /api/leaderboard
 * Returns top users sorted by XP and streaks
 */
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: [
        { xp: 'desc' },
        { streak: 'desc' },
      ],
      take: 20, // top 20 users
      select: {
        id: true,
        name: true,
        email: true,
        xp: true,
        streak: true,
        level: true,
      },
    });

    res.status(200).json({ leaderboard: topUsers });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Could not fetch leaderboard.' });
  }
};
