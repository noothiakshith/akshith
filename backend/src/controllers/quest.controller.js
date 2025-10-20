import { processQuestSubmission } from '../services/progress.service.js';
import prisma from '../utils/prisma.js';

export const getQuests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get quests with different types for the quests page
    const quests = await prisma.quest.findMany({
      where: {
        type: {
          in: ['fill_blank', 'match', 'jumble']
        }
      },
      include: {
        lesson: {
          select: {
            title: true,
            level: true
          }
        }
      },
      orderBy: [
        { type: 'asc' },
        { difficulty: 'asc' },
        { order: 'asc' }
      ],
      take: 20 // Limit to 20 quests for now
    });

    // Group quests by type
    const questsByType = {
      fill_blank: quests.filter(q => q.type === 'fill_blank'),
      match: quests.filter(q => q.type === 'match'),
      jumble: quests.filter(q => q.type === 'jumble')
    };

    res.json({ quests: questsByType });
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ error: error.message });
  }
};

export const submitQuestAnswer = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from protect middleware
    const questId = parseInt(req.params.id);
    const { userAnswer } = req.body;

    if (userAnswer === undefined) {
      return res.status(400).json({ error: 'userAnswer is required.' });
    }

    const result = await processQuestSubmission({ userId, questId, userAnswer });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error submitting quest answer:', error);
    res.status(500).json({ error: error.message });
  }
};
