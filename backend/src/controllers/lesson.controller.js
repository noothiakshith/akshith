// src/controllers/lesson.controller.js
import prisma from '../utils/prisma.js';

// Get all lessons
export const getAllLessons = async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { order: 'asc' },
    });
    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch lessons.' });
  }
};

// Get lesson by ID
export const getLessonById = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
    });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });
    res.status(200).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch the lesson.' });
  }
};
