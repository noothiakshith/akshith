// src/services/notification.service.js
import prisma from '../utils/prisma.js';

class NotificationService {
  /**
   * Create a notification for the user
   */
  async createNotification(userId, title, message, type, actionUrl = null) {
    try {
      return await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          actionUrl,
          read: false
        }
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId, limit = 20) {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      return await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId
        },
        data: { read: true }
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    try {
      return await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId) {
    try {
      return await prisma.notification.count({
        where: { userId, read: false }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Create achievement notification
   */
  async notifyAchievement(userId, achievementName, description, coinReward) {
    return await this.createNotification(
      userId,
      '🏆 Achievement Unlocked!',
      `Congratulations! You've earned "${achievementName}". ${description} +${coinReward} coins!`,
      'achievement',
      '/achievements'
    );
  }

  /**
   * Create chapter unlock notification
   */
  async notifyChapterUnlock(userId, chapterTitle) {
    return await this.createNotification(
      userId,
      '📚 New Chapter Unlocked!',
      `Great progress! You've unlocked "${chapterTitle}". Keep up the excellent work!`,
      'chapter_unlock',
      '/chapters'
    );
  }

  /**
   * Create streak notification
   */
  async notifyStreak(userId, streakDays) {
    return await this.createNotification(
      userId,
      '🔥 Streak Milestone!',
      `Amazing! You've maintained a ${streakDays}-day learning streak. Don't break the chain!`,
      'streak',
      '/dashboard'
    );
  }

  /**
   * Create review reminder notification
   */
  async notifyReviewReminder(userId, mistakeCount) {
    return await this.createNotification(
      userId,
      '📝 Review Time!',
      `You have ${mistakeCount} items to review. Practice makes perfect!`,
      'review',
      '/review'
    );
  }

  /**
   * Create level up notification
   */
  async notifyLevelUp(userId, newLevel) {
    return await this.createNotification(
      userId,
      '⭐ Level Up!',
      `Congratulations! You've reached ${newLevel} level. Your learning journey continues!`,
      'level_up',
      '/dashboard'
    );
  }

  /**
   * Create daily goal notification
   */
  async notifyDailyGoal(userId, goalMinutes) {
    return await this.createNotification(
      userId,
      '🎯 Daily Goal',
      `Your daily goal is ${goalMinutes} minutes of learning. Let's make it happen!`,
      'daily_goal',
      '/dashboard'
    );
  }

  /**
   * Create adaptive content notification
   */
  async notifyAdaptiveContent(userId, lessonCount) {
    return await this.createNotification(
      userId,
      '🧠 Personalized Content',
      `We've created ${lessonCount} new lessons tailored to your learning needs!`,
      'adaptive_content',
      '/chapters'
    );
  }

  /**
   * Clean up old notifications (older than 30 days)
   */
  async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: { lt: thirtyDaysAgo },
          read: true
        }
      });

      console.log(`Cleaned up ${result.count} old notifications`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }
  }

  /**
   * Send bulk notifications to multiple users
   */
  async sendBulkNotification(userIds, title, message, type, actionUrl = null) {
    try {
      const notifications = userIds.map(userId => ({
        userId,
        title,
        message,
        type,
        actionUrl,
        read: false
      }));

      return await prisma.notification.createMany({
        data: notifications
      });
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics for admin dashboard
   */
  async getNotificationStats() {
    try {
      const total = await prisma.notification.count();
      const unread = await prisma.notification.count({
        where: { read: false }
      });
      const byType = await prisma.notification.groupBy({
        by: ['type'],
        _count: { type: true }
      });

      return {
        total,
        unread,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count.type;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }
}

export default new NotificationService();
