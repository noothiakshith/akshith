// src/services/analytics.service.js
import prisma from '../utils/prisma.js';

class AnalyticsService {
  /**
   * Get AI generation analytics
   */
  async getAIGenerationStats(timeframe = '7d') {
    try {
      const days = this.getDaysFromTimeframe(timeframe);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stats = await prisma.aiGenerationLog.groupBy({
        by: ['type', 'successful'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: { type: true },
        _avg: { duration: true }
      });

      const totalGenerations = await prisma.aiGenerationLog.count({
        where: { createdAt: { gte: startDate } }
      });

      const successfulGenerations = await prisma.aiGenerationLog.count({
        where: {
          createdAt: { gte: startDate },
          successful: true
        }
      });

      const averageDuration = await prisma.aiGenerationLog.aggregate({
        where: { createdAt: { gte: startDate } },
        _avg: { duration: true }
      });

      return {
        totalGenerations,
        successfulGenerations,
        successRate: totalGenerations > 0 ? (successfulGenerations / totalGenerations) * 100 : 0,
        averageDuration: averageDuration._avg.duration || 0,
        byType: this.groupStatsByType(stats)
      };
    } catch (error) {
      console.error('Error getting AI generation stats:', error);
      throw error;
    }
  }

  /**
   * Get user learning analytics
   */
  async getUserLearningStats(userId, timeframe = '30d') {
    try {
      const days = this.getDaysFromTimeframe(timeframe);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get user progress data
      const progressStats = await prisma.progress.aggregate({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _count: { id: true },
        _avg: { accuracy: true },
        _sum: { xpEarned: true, timeSpent: true }
      });

      // Get mistake patterns
      const mistakeStats = await prisma.mistake.groupBy({
        by: ['category'],
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _count: { category: true }
      });

      // Get streak data
      const streakData = await prisma.streak.findUnique({
        where: { userId }
      });

      // Get achievement data
      const achievements = await prisma.userAchievement.count({
        where: {
          userId,
          unlockedAt: { gte: startDate }
        }
      });

      return {
        lessonsCompleted: progressStats._count.id,
        averageAccuracy: progressStats._avg.accuracy || 0,
        totalXPEarned: progressStats._sum.xpEarned || 0,
        totalTimeSpent: progressStats._sum.timeSpent || 0,
        mistakePatterns: mistakeStats.reduce((acc, stat) => {
          acc[stat.category] = stat._count.category;
          return acc;
        }, {}),
        currentStreak: streakData?.currentStreak || 0,
        longestStreak: streakData?.longestStreak || 0,
        achievementsUnlocked: achievements
      };
    } catch (error) {
      console.error('Error getting user learning stats:', error);
      throw error;
    }
  }

  /**
   * Get system-wide analytics
   */
  async getSystemAnalytics(timeframe = '30d') {
    try {
      const days = this.getDaysFromTimeframe(timeframe);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // User statistics
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: {
          lastActiveDate: { gte: startDate }
        }
      });

      // Content statistics
      const totalChapters = await prisma.chapter.count();
      const totalLessons = await prisma.lesson.count();
      const totalQuests = await prisma.quest.count();

      // Progress statistics
      const totalProgress = await prisma.progress.count({
        where: { createdAt: { gte: startDate } }
      });

      const completedLessons = await prisma.progress.count({
        where: {
          createdAt: { gte: startDate },
          completed: true
        }
      });

      // Mistake statistics
      const totalMistakes = await prisma.mistake.count({
        where: { createdAt: { gte: startDate } }
      });

      // Achievement statistics
      const totalAchievements = await prisma.userAchievement.count({
        where: { unlockedAt: { gte: startDate } }
      });

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          retentionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
        },
        content: {
          chapters: totalChapters,
          lessons: totalLessons,
          quests: totalQuests
        },
        engagement: {
          totalProgress,
          completedLessons,
          completionRate: totalProgress > 0 ? (completedLessons / totalProgress) * 100 : 0,
          totalMistakes,
          totalAchievements
        }
      };
    } catch (error) {
      console.error('Error getting system analytics:', error);
      throw error;
    }
  }

  /**
   * Get learning effectiveness metrics
   */
  async getLearningEffectiveness(userId) {
    try {
      // Get user's progress over time
      const progressHistory = await prisma.progress.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: {
          accuracy: true,
          createdAt: true,
          lesson: {
            select: { level: true }
          }
        }
      });

      // Calculate learning curve
      const learningCurve = this.calculateLearningCurve(progressHistory);

      // Get mistake recovery rate
      const mistakeRecovery = await this.calculateMistakeRecovery(userId);

      // Get content difficulty analysis
      const difficultyAnalysis = await this.analyzeContentDifficulty(userId);

      return {
        learningCurve,
        mistakeRecovery,
        difficultyAnalysis,
        overallEffectiveness: this.calculateOverallEffectiveness(learningCurve, mistakeRecovery)
      };
    } catch (error) {
      console.error('Error getting learning effectiveness:', error);
      throw error;
    }
  }

  /**
   * Get AI model performance metrics
   */
  async getAIModelPerformance(timeframe = '7d') {
    try {
      const days = this.getDaysFromTimeframe(timeframe);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const modelStats = await prisma.aiGenerationLog.groupBy({
        by: ['model'],
        where: { createdAt: { gte: startDate } },
        _count: { model: true },
        _avg: { duration: true },
        _sum: { successful: true }
      });

      return modelStats.map(stat => ({
        model: stat.model,
        totalGenerations: stat._count.model,
        successRate: stat._count.model > 0 ? (stat._sum.successful / stat._count.model) * 100 : 0,
        averageDuration: stat._avg.duration || 0
      }));
    } catch (error) {
      console.error('Error getting AI model performance:', error);
      throw error;
    }
  }

  /**
   * Helper methods
   */
  getDaysFromTimeframe(timeframe) {
    const timeframes = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    return timeframes[timeframe] || 30;
  }

  groupStatsByType(stats) {
    const grouped = {};
    stats.forEach(stat => {
      if (!grouped[stat.type]) {
        grouped[stat.type] = { total: 0, successful: 0, averageDuration: 0 };
      }
      grouped[stat.type].total += stat._count.type;
      if (stat.successful) {
        grouped[stat.type].successful += stat._count.type;
      }
      grouped[stat.type].averageDuration = stat._avg.duration || 0;
    });
    return grouped;
  }

  calculateLearningCurve(progressHistory) {
    if (progressHistory.length < 2) return { trend: 'insufficient_data' };

    const recent = progressHistory.slice(-10);
    const older = progressHistory.slice(0, -10);

    const recentAvg = recent.reduce((sum, p) => sum + p.accuracy, 0) / recent.length;
    const olderAvg = older.length > 0 ? 
      older.reduce((sum, p) => sum + p.accuracy, 0) / older.length : recentAvg;

    const improvement = recentAvg - olderAvg;
    
    if (improvement > 5) return { trend: 'improving', rate: improvement };
    if (improvement < -5) return { trend: 'declining', rate: improvement };
    return { trend: 'stable', rate: improvement };
  }

  async calculateMistakeRecovery(userId) {
    const mistakes = await prisma.mistake.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { quest: true }
    });

    // Group mistakes by quest type
    const mistakesByType = {};
    mistakes.forEach(mistake => {
      const type = mistake.quest?.type || 'unknown';
      if (!mistakesByType[type]) {
        mistakesByType[type] = [];
      }
      mistakesByType[type].push(mistake);
    });

    // Calculate recovery rate for each type
    const recoveryRates = {};
    Object.entries(mistakesByType).forEach(([type, typeMistakes]) => {
      // Simple recovery rate calculation
      // In a more sophisticated system, you'd track if users got similar questions right later
      recoveryRates[type] = {
        totalMistakes: typeMistakes.length,
        recoveryRate: 0.7 // Placeholder - would need more complex logic
      };
    });

    return recoveryRates;
  }

  async analyzeContentDifficulty(userId) {
    const progress = await prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: { level: true }
        }
      }
    });

    const difficultyStats = {};
    progress.forEach(p => {
      const level = p.lesson.level;
      if (!difficultyStats[level]) {
        difficultyStats[level] = { total: 0, completed: 0, avgAccuracy: 0 };
      }
      difficultyStats[level].total++;
      if (p.completed) difficultyStats[level].completed++;
      difficultyStats[level].avgAccuracy += p.accuracy;
    });

    // Calculate completion rates and average accuracy
    Object.keys(difficultyStats).forEach(level => {
      const stats = difficultyStats[level];
      stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      stats.avgAccuracy = stats.total > 0 ? stats.avgAccuracy / stats.total : 0;
    });

    return difficultyStats;
  }

  calculateOverallEffectiveness(learningCurve, mistakeRecovery) {
    let score = 50; // Base score

    // Adjust based on learning curve
    if (learningCurve.trend === 'improving') score += 20;
    else if (learningCurve.trend === 'declining') score -= 20;

    // Adjust based on mistake recovery
    const avgRecoveryRate = Object.values(mistakeRecovery)
      .reduce((sum, rate) => sum + rate.recoveryRate, 0) / Object.keys(mistakeRecovery).length;
    score += (avgRecoveryRate - 0.5) * 30;

    return Math.max(0, Math.min(100, score));
  }
}

export default new AnalyticsService();
