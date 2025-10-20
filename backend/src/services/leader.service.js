import prisma from '../utils/prisma.js';

/**
 * Fetch top users for a specific leaderboard type
 * @param {string} type - "xp" | "coins" | "streak"
 * @param {number} limit - number of users to return
 */
export const fetchLeaderboard = async (type = 'xp', limit = 10) => {
  const validTypes = ['xp', 'coins', 'streak'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid leaderboard type. Must be one of ${validTypes.join(', ')}`);
  }

  const users = await prisma.user.findMany({
    orderBy: { [type]: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      xp: true,
      coins: true,
      streak: true,
    },
  });

  return users;
};
