import socket from './socket';

// Notification event handlers
export const subscribeToNotifications = (userId, callbacks) => {
  if (!userId) {
    console.error('No userId provided to subscribeToNotifications');
    return;
  }

  // Get initial notifications
  socket.emit('getNotifications', { idUser: userId });

  // Listen for notification list
  socket.on('notificationsList', (notifications) => {
    if (callbacks.onNotificationsList) {
      callbacks.onNotificationsList(notifications || []);
    }
  });

  // Listen for new notifications
  socket.on('newNotification', (notification) => {
    if (callbacks.onNewNotification) {
      callbacks.onNewNotification(notification);
    }
  });

  // Listen for notification read status updates
  socket.on('notificationMarkedRead', ({ notificationId }) => {
    if (callbacks.onNotificationRead) {
      callbacks.onNotificationRead(notificationId);
    }
  });

  // Listen for all notifications marked as read
  socket.on('allNotificationsMarkedRead', () => {
    if (callbacks.onAllNotificationsRead) {
      callbacks.onAllNotificationsRead();
    }
  });

  return () => {
    socket.off('notificationsList');
    socket.off('newNotification');
    socket.off('notificationMarkedRead');
    socket.off('allNotificationsMarkedRead');
  };
};

// Notification actions
export const markNotificationAsRead = (userId, notificationId) => {
  if (!userId || !notificationId) {
    console.error('Missing userId or notificationId in markNotificationAsRead');
    return;
  }
  socket.emit('markNotificationRead', { idUser: userId, notificationId });
};

export const markAllNotificationsAsRead = (userId) => {
  if (!userId) {
    console.error('Missing userId in markAllNotificationsAsRead');
    return;
  }
  socket.emit('markAllNotificationsRead', { idUser: userId });
};

export const deleteNotification = (userId, notificationId) => {
  if (!userId || !notificationId) {
    console.error('Missing userId or notificationId in deleteNotification');
    return;
  }
  socket.emit('deleteNotification', { idUser: userId, notificationId });
};
