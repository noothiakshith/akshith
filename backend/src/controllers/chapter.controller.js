import prisma from "../utils/prisma.js";

export const getAllChapters = async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: 'asc' },
    });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch chapters.' });
  }
};

export const getChapterById = async (req, res) => {
  const { id } = req.params;
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
      include: {
        lessons: { orderBy: { order: 'asc' } },
      },
    });
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found.' });
    }
    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch the chapter.' });
  }
};
