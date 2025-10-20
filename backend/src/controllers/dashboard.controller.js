import { fetchDashboardData } from '../services/dashboard.service.js';
import adaptiveService from '../services/adaptive.service.js';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardData = await fetchDashboardData(userId);
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Could not fetch dashboard data.' });
  }
};

export const getLearningInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const insights = await adaptiveService.getLearningInsights(userId);
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error fetching learning insights:', error);
    res.status(500).json({ error: 'Could not fetch learning insights.' });
  }
};

export const triggerAdaptiveLearning = async (req, res) => {
  try {
    const userId = req.user.id;
    const analysis = await adaptiveService.processUserSession(userId);
    res.status(200).json({ 
      message: 'Adaptive learning analysis completed',
      analysis 
    });
  } catch (error) {
    console.error('Error triggering adaptive learning:', error);
    res.status(500).json({ error: 'Could not process adaptive learning.' });
  }
};
