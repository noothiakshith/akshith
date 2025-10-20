import express from 'express';
import { getSettings, updateSettings } from '../controllers/setting.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All settings routes are protected
router.use(protect);

// GET and PUT for the same route
router.route('/')
  .get(getSettings)
  .put(updateSettings);

export default router;
