import { processQuestSubmission } from '../services/progress.service.js';

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
