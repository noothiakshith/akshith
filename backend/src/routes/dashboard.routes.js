import express from 'express';
const Router = express.Router();
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

Router.get('/', protect, getDashboardData);

export default Router;
