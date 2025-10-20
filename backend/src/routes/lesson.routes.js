import express from 'express';
const router = express.Router()
import {getLessonById} from '../controllers/lesson.controller.js'
router.get('/:id', getLessonById); // This will include quests

export default router;