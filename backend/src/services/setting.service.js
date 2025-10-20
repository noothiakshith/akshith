import prisma from '../utils/prisma.js';

/**
 * Fetches the settings for a given user.
 * @param {number} userId The user's ID.
 */
export const getUserSettings = async (userId) => {
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  // Handle users created before settings model was linked automatically.
  if (!settings) {
    return prisma.userSettings.create({
      data: { userId },
    });
  }
  return settings;
};

/**
 * Updates the settings for a given user.
 * @param {number} userId The user's ID.
 * @param {object} settingsData The new settings data to apply.
 */
export const updateUserSettings = async (userId, settingsData) => {
  const allowedUpdates = {
    darkMode: settingsData.darkMode,
    notifications: settingsData.notifications,
    streakReminder: settingsData.streakReminder,
    reviewReminder: settingsData.reviewReminder,
    soundEffects: settingsData.soundEffects,
    dailyGoalMinutes: settingsData.dailyGoalMinutes,
  };

  const dataToUpdate = Object.fromEntries(
    Object.entries(allowedUpdates).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error("No valid settings data provided for update.");
  }

  return prisma.userSettings.update({
    where: { userId },
    data: dataToUpdate,
  });
};
