// src/services/adaptive.service.js
import prisma from '../utils/prisma.js';
import aiService from './ai.service.js';
import { processQuestSubmission } from './progress.service.js';

class AdaptiveLearningService {
  /**
   * Main adaptive learning engine that runs after each user session
   * Analyzes user performance and generates targeted content
   */
  async processUserSession(userId) {
    try {
      // 1. Analyze user weaknesses
      const analysis = await this.analyzeUserPerformance(userId);
      
      // 2. Check if adaptive content is needed
      if (analysis.needsAdaptiveContent) {
        await this.generateAdaptiveContent(userId, analysis);
      }
      
      // 3. Update user's learning path
      await this.updateLearningPath(userId, analysis);
      
      // 4. Generate review recommendations
      await this.generateReviewRecommendations(userId, analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error in adaptive learning process:', error);
      throw error;
    }
  }

  /**
   * Analyze user performance to identify learning patterns
   */
  async analyzeUserPerformance(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          include: { lesson: true }
        },
        mistakes: {
          include: { quest: true },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    if (!user) throw new Error('User not found');

    // Calculate overall metrics
    const totalProgress = user.progress.length;
    const completedLessons = user.progress.filter(p => p.completed).length;
    const overallAccuracy = totalProgress > 0 ? 
      user.progress.reduce((sum, p) => sum + p.accuracy, 0) / totalProgress : 0;

    // Analyze mistake patterns
    const mistakeCategories = {};
    const recentMistakes = user.mistakes.slice(0, 20);
    
    recentMistakes.forEach(mistake => {
      const category = mistake.category || 'general';
      mistakeCategories[category] = (mistakeCategories[category] || 0) + 1;
    });

    // Identify weak areas
    const weakAreas = Object.entries(mistakeCategories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    // Determine if adaptive content is needed
    const needsAdaptiveContent = recentMistakes.length >= 5 || overallAccuracy < 60;
    
    // Determine difficulty adjustment
    let difficultyAdjustment = 'maintain';
    if (overallAccuracy < 50) {
      difficultyAdjustment = 'decrease';
    } else if (overallAccuracy > 80) {
      difficultyAdjustment = 'increase';
    }

    return {
      userId,
      level: user.level,
      totalProgress,
      completedLessons,
      overallAccuracy,
      recentMistakes,
      mistakeCategories,
      weakAreas,
      needsAdaptiveContent,
      difficultyAdjustment,
      streak: user.streak,
      xp: user.xp
    };
  }

  /**
   * Generate adaptive content based on user weaknesses
   */
  async generateAdaptiveContent(userId, analysis) {
    try {
      console.log(`Generating adaptive content for user ${userId}`);
      
      // Generate targeted lessons for weak areas
      const adaptiveLessons = await aiService.generateAdaptiveLessons(
        userId,
        analysis.recentMistakes,
        analysis.level
      );

      // Find the last chapter to add adaptive lessons
      const lastChapter = await prisma.chapter.findFirst({
        where: { level: analysis.level },
        orderBy: { order: 'desc' }
      });

      if (!lastChapter) {
        console.log('No chapters found for adaptive content');
        return;
      }

      // Create adaptive lessons
      for (const lessonData of adaptiveLessons) {
        const lesson = await prisma.lesson.create({
          data: {
            chapterId: lastChapter.id,
            title: `[Adaptive] ${lessonData.title}`,
            content: lessonData.content,
            vocabulary: lessonData.vocabulary,
            grammar: lessonData.grammar,
            level: lessonData.level,
            order: 999, // Place at end
            xpReward: lessonData.xpReward,
            coinReward: lessonData.coinReward
          }
        });

        // Generate quests for adaptive lesson
        const quests = await aiService.generateQuests(
          lesson.id,
          lesson.title,
          lesson.vocabulary,
          analysis.level
        );

        for (const questData of quests) {
          await prisma.quest.create({
            data: {
              lessonId: lesson.id,
              type: questData.type,
              question: questData.question,
              options: questData.options,
              answer: questData.answer,
              hint: questData.hint,
              difficulty: questData.difficulty,
              order: questData.order,
              xpReward: questData.xpReward
            }
          });
        }
      }

      // Generate flashcards from mistakes
      const flashcards = await aiService.generateFlashcards(
        analysis.recentMistakes,
        'French'
      );

      for (const flashcardData of flashcards) {
        await prisma.flashcard.create({
          data: {
            userId,
            front: flashcardData.front,
            back: flashcardData.back,
            difficulty: flashcardData.difficulty,
            source: 'adaptive',
            nextReview: new Date() // Ready for immediate review
          }
        });
      }

      console.log(`Generated ${adaptiveLessons.length} adaptive lessons and ${flashcards.length} flashcards`);
    } catch (error) {
      console.error('Error generating adaptive content:', error);
    }
  }

  /**
   * Update user's learning path based on performance
   */
  async updateLearningPath(userId, analysis) {
    try {
      // Unlock next chapter if user has enough XP
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const nextChapter = await prisma.chapter.findFirst({
        where: {
          level: analysis.level,
          xpRequired: { lte: user.xp },
          isUnlocked: false
        },
        orderBy: { order: 'asc' }
      });

      if (nextChapter) {
        await prisma.chapter.update({
          where: { id: nextChapter.id },
          data: { isUnlocked: true }
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            title: 'New Chapter Unlocked!',
            message: `Congratulations! You've unlocked "${nextChapter.title}"`,
            type: 'chapter_unlock',
            actionUrl: `/chapters/${nextChapter.id}`
          }
        });

        console.log(`Unlocked chapter: ${nextChapter.title}`);
      }

      // Adjust lesson difficulty based on performance
      if (analysis.difficultyAdjustment !== 'maintain') {
        await this.adjustLessonDifficulty(userId, analysis.difficultyAdjustment);
      }
    } catch (error) {
      console.error('Error updating learning path:', error);
    }
  }

  /**
   * Adjust lesson difficulty based on user performance
   */
  async adjustLessonDifficulty(userId, adjustment) {
    // This would modify future quest generation parameters
    // For now, we'll log the adjustment
    console.log(`Adjusting difficulty for user ${userId}: ${adjustment}`);
    
    // In a more sophisticated implementation, you might:
    // - Store difficulty preferences in user settings
    // - Modify AI prompts based on user performance
    // - Generate easier or harder content accordingly
  }

  /**
   * Generate personalized review recommendations
   */
  async generateReviewRecommendations(userId, analysis) {
    try {
      // Generate review summary
      const reviewSummary = await aiService.generateReviewSummary(userId);
      
      // Create review notification if needed
      if (analysis.recentMistakes.length >= 3) {
        await prisma.notification.create({
          data: {
            userId,
            title: 'Review Recommended',
            message: `You have ${analysis.recentMistakes.length} recent mistakes to review. Focus on: ${analysis.weakAreas.join(', ')}`,
            type: 'review',
            actionUrl: '/review'
          }
        });
      }

      return reviewSummary;
    } catch (error) {
      console.error('Error generating review recommendations:', error);
    }
  }

  /**
   * Get personalized learning insights for dashboard
   */
  async getLearningInsights(userId) {
    const analysis = await this.analyzeUserPerformance(userId);
    
    // Get recent achievements
    const recentAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 3
    });

    // Get upcoming goals
    const nextChapter = await prisma.chapter.findFirst({
      where: {
        level: analysis.level,
        isUnlocked: false
      },
      orderBy: { order: 'asc' }
    });

    return {
      ...analysis,
      recentAchievements,
      nextGoal: nextChapter ? {
        title: nextChapter.title,
        xpNeeded: nextChapter.xpRequired - analysis.xp
      } : null
    };
  }

  /**
   * Process quest submission with adaptive learning
   */
  async processQuestWithAdaptation(userId, questId, userAnswer) {
    // Process the quest submission normally
    const result = await processQuestSubmission({ userId, questId, userAnswer });
    
    // Trigger adaptive learning analysis
    setImmediate(() => {
      this.processUserSession(userId).catch(console.error);
    });
    
    return result;
  }
}

export default new AdaptiveLearningService();
