import { getUserSettings, updateUserSettings } from '../services/setting.service.js';

export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await getUserSettings(userId);
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Could not fetch user settings.' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedSettings = await updateUserSettings(userId, req.body);
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(400).json({ error: error.message });
  }
};
