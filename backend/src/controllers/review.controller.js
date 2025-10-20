import { generateReviewQuiz, checkReviewAnswer } from '../services/review.service.js';

export const startReviewQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const quiz = await generateReviewQuiz(userId);
    res.status(200).json(quiz);
  } catch (error) {
    if (error.message.includes("No mistakes")) {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Could not generate review quiz.' });
  }
};

export const submitReviewAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mistakeId, userAnswer } = req.body;

    if (mistakeId === undefined || userAnswer === undefined) {
      return res.status(400).json({ error: 'mistakeId and userAnswer are required.' });
    }

    const result = await checkReviewAnswer({ userId, mistakeId, userAnswer });
    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
