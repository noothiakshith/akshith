import express from 'express';
const Router = express.Router();
import { getDashboardData, getLearningInsights, triggerAdaptiveLearning } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

Router.get('/', protect, getDashboardData);
Router.get('/insights', protect, getLearningInsights);
Router.post('/adaptive-learning', protect, triggerAdaptiveLearning);

export default Router;
