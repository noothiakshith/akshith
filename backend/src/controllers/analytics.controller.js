// src/controllers/analytics.controller.js
import analyticsService from '../services/analytics.service.js';

export const getAIGenerationStats = async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    const stats = await analyticsService.getAIGenerationStats(timeframe);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching AI generation stats:', error);
    res.status(500).json({ error: 'Could not fetch AI generation stats.' });
  }
};

export const getUserLearningStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = '30d' } = req.query;
    const stats = await analyticsService.getUserLearningStats(userId, timeframe);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching user learning stats:', error);
    res.status(500).json({ error: 'Could not fetch user learning stats.' });
  }
};

export const getSystemAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const stats = await analyticsService.getSystemAnalytics(timeframe);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    res.status(500).json({ error: 'Could not fetch system analytics.' });
  }
};

export const getLearningEffectiveness = async (req, res) => {
  try {
    const userId = req.user.id;
    const effectiveness = await analyticsService.getLearningEffectiveness(userId);
    res.status(200).json(effectiveness);
  } catch (error) {
    console.error('Error fetching learning effectiveness:', error);
    res.status(500).json({ error: 'Could not fetch learning effectiveness.' });
  }
};

export const getAIModelPerformance = async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    const performance = await analyticsService.getAIModelPerformance(timeframe);
    res.status(200).json(performance);
  } catch (error) {
    console.error('Error fetching AI model performance:', error);
    res.status(500).json({ error: 'Could not fetch AI model performance.' });
  }
};
