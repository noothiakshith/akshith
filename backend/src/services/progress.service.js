// src/services/progress.service.js
import prisma from '../utils/prisma.js';
import { updateStreak } from './streak.service.js';
import { checkAchievements } from './achievement.service.js';
/**
 * Process a user's quest submission:
 * - Update progress
 * - Award XP for correct answers
 * - Award coins for lesson completion
 * - Track mistakes for wrong answers
 * - Create flashcards for mistakes
 * - Update daily streak on any activity
 */
const processQuestSubmission = async ({ userId, questId, userAnswer }) => {
  // 1️⃣ Fetch the quest along with lesson info
  const quest = await prisma.quest.findUnique({
    where: { id: questId },
    include: {
      lesson: {
        include: {
          _count: { select: { quests: true } }, // Total quests in lesson
        },
      },
    },
  });

  if (!quest) throw new Error('Quest not found.');

  const isCorrect = quest.answer.toLowerCase() === userAnswer.toLowerCase();
  const lessonId = quest.lessonId;
  const xpReward = quest.xpReward;
  const lessonCoinReward = quest.lesson.coinReward;
  const totalQuestsInLesson = quest.lesson._count.quests;

  let lessonCompleted = false; // Flag if lesson was just completed
  let awardedLessonCoins = 0;

  // 2️⃣ Transaction: update progress, XP, mistakes, and flashcards
  const [progress] = await prisma.$transaction([
    // a. Upsert progress
    prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        attempts: 1,
        questsCompleted: isCorrect ? 1 : 0,
        xpEarned: isCorrect ? xpReward : 0,
        questsTotal: totalQuestsInLesson,
      },
      update: {
        attempts: { increment: 1 },
        questsCompleted: { increment: isCorrect ? 1 : 0 },
        xpEarned: { increment: isCorrect ? xpReward : 0 },
      },
    }),

    // b. Update user's XP if correct
    ...(isCorrect
      ? [
          prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: xpReward } },
          }),
        ]
      : []),
    // c. Create mistake + flashcard if incorrect
    ...(!isCorrect
      ? [
          prisma.mistake.create({
            data: {
              userId,
              questId,
              userAnswer,
              correctAnswer: quest.answer,
              category: 'general',
            },
          }),
          prisma.flashcard.create({
            data: {
              userId,
              front: quest.question.replace(/__/g, `[${quest.answer}]`),
              back: `Your Answer: ${userAnswer}\nCorrect Answer: ${quest.answer}`,
              source: 'mistake',
              sourceId: questId,
              nextReview: new Date(), // ready for review immediately
            },
          }),
        ]
      : []),
  ]);

  // 2.5️⃣ Check achievements if correct answer
  if (isCorrect) {
    await checkAchievements(userId);
  }

  // 3️⃣ Recalculate accuracy
  const finalProgress = await prisma.progress.update({
    where: { id: progress.id },
    data: {
      accuracy: (progress.questsCompleted / progress.attempts) * 100,
    },
  });

  // 4️⃣ Check for lesson completion
  if (isCorrect && progress.questsCompleted === totalQuestsInLesson) {
    if (!finalProgress.completed) {
      lessonCompleted = true;
      awardedLessonCoins = lessonCoinReward;

      await prisma.$transaction([
        prisma.progress.update({
          where: { id: finalProgress.id },
          data: { completed: true, completedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { coins: { increment: awardedLessonCoins } },
        }),
      ]);
    }
  }

  // 5️⃣ Update daily streak on any activity (correct or incorrect)
  const streakInfo = await updateStreak(userId);

  // 6️⃣ Return detailed result
  return {
    isCorrect,
    correctAnswer: quest.answer,
    lessonCompleted,
    awardedLessonCoins,
    streakInfo,
    progress: { ...finalProgress, completed: lessonCompleted || finalProgress.completed },
  };
};

export { processQuestSubmission };
