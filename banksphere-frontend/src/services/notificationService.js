/**
 * Notification Service
 * Manages customer notification retrieval and read status updates.
 * Connected directly to Spring Boot backend APIs.
 */
import api from './api';

const mapNotificationResponse = (n) => {
  const title = n.title || '';
  let type = 'security';
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('credit') || lowerTitle.includes('received')) {
    type = 'credit';
  } else if (lowerTitle.includes('debit') || lowerTitle.includes('sent') || lowerTitle.includes('transfer')) {
    type = 'transfer';
  } else if (lowerTitle.includes('loan')) {
    type = 'loan';
  } else if (lowerTitle.includes('complaint') || lowerTitle.includes('grievance') || lowerTitle.includes('support')) {
    type = 'support';
  }

  return {
    id: n.id,
    title: n.title,
    message: n.message,
    isRead: Boolean(n.read),
    date: n.createdAt,
    type,
  };
};

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return (response.data || []).map(mapNotificationResponse);
    } catch (err) {
      console.warn('Could not load notifications from server', err.message);
      return [];
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch {
      return 0;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      return true;
    } catch (err) {
      console.warn('Failed to mark notification as read', err.message);
      return false;
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put('/notifications/read-all');
      return true;
    } catch (err) {
      console.warn('Failed to mark all notifications as read', err.message);
      return false;
    }
  },
};
