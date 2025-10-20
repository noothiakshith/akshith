import express from 'express';
const Router = express.Router();
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount, 
  deleteNotification 
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

Router.get('/', protect, getNotifications);
Router.get('/unread-count', protect, getUnreadCount);
Router.put('/:notificationId/read', protect, markAsRead);
Router.put('/mark-all-read', protect, markAllAsRead);
Router.delete('/:notificationId', protect, deleteNotification);

export default Router;
