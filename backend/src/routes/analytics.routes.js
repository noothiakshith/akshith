import express from 'express';
const Router = express.Router();
import { 
  getAIGenerationStats, 
  getUserLearningStats, 
  getSystemAnalytics, 
  getLearningEffectiveness, 
  getAIModelPerformance 
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// All analytics routes require authentication
Router.use(protect);

Router.get('/ai-generation', getAIGenerationStats);
Router.get('/user-learning', getUserLearningStats);
Router.get('/system', getSystemAnalytics);
Router.get('/learning-effectiveness', getLearningEffectiveness);
Router.get('/ai-model-performance', getAIModelPerformance);

export default Router;
