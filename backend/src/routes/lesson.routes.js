import express from 'express';
import { getLessonById } from '../controllers/lesson.controller.js';

const router = express.Router();

router.get('/:id', getLessonById); // This will include quests

export default router;