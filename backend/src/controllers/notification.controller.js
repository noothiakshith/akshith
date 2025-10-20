// src/controllers/notification.controller.js
import notificationService from '../services/notification.service.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;
    
    const notifications = await notificationService.getUserNotifications(userId, parseInt(limit));
    const unreadCount = await notificationService.getUnreadCount(userId);
    
    res.status(200).json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Could not fetch notifications.' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    
    await notificationService.markAsRead(parseInt(notificationId), userId);
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Could not mark notification as read.' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await notificationService.markAllAsRead(userId);
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Could not mark all notifications as read.' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);
    
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: 'Could not get unread count.' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    
    // Delete notification (user can only delete their own)
    const result = await prisma.notification.deleteMany({
      where: {
        id: parseInt(notificationId),
        userId
      }
    });
    
    if (result.count === 0) {
      return res.status(404).json({ error: 'Notification not found.' });
    }
    
    res.status(200).json({ message: 'Notification deleted.' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Could not delete notification.' });
  }
};
