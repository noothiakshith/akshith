import { fetchDashboardData } from '../services/dashboard.service.js';

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
