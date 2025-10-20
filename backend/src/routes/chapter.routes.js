import { Router } from 'express';
import { getAllChapters, getChapterById } from '../controllers/chapter.controller.js';

const router = Router();

router.get('/', getAllChapters);
router.get('/:id', getChapterById); // This will include lessons

export default router;