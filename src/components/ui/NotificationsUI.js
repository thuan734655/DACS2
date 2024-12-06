import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getSocket, initializeSocket } from '../../services/socketService';
import { getNotificationMessage, getNotificationIcon, showNotificationToast } from '../../services/notificationService';
import NotificationDetailUI from './NotificationDetailUI';
import socket from '../../services/socket';

const NotificationsUI = ({ user, data }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const idUser = JSON.parse(localStorage.getItem('user'))?.idUser;

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        if (!idUser) {
          throw new Error('User not found');
        }

        const socket = getSocket() || initializeSocket();
        
        // Join notification room
        socket.emit('joinNotificationRoom', { idUser });

        // Listen for notifications list
        socket.on('notificationsList', (notificationsList) => {
          const sortedNotifications = notificationsList.sort((a, b) => b.timestamp - a.timestamp);
          setNotifications(sortedNotifications);
          setUnreadCount(sortedNotifications.filter(n => !n.read).length);
          setLoading(false);
        });

        // Listen for new notifications
        socket.on('newNotification', (notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          showNotificationToast(notification);
        });

        // Listen for notification updates
        socket.on('notificationUpdated', (updatedNotification) => {
          setNotifications(prev =>
            prev.map(n => {
              if (n.id === updatedNotification.id) {
                // If notification was unread and is now read, decrease unread count
                if (!n.read && updatedNotification.read) {
                  setUnreadCount(count => Math.max(0, count - 1));
                }
                return updatedNotification;
              }
              return n;
            })
          );
        });

        // Handle errors
        socket.on('error', (socketError) => {
          setError(socketError.message);
          setLoading(false);
        });

        // Request initial notifications
        socket.emit('getNotifications', { idUser });

        return () => {
          socket.off('notificationsList');
          socket.off('newNotification');
          socket.off('notificationUpdated');
          socket.off('error');
        };
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initializeNotifications();
  }, [idUser]);

  // Hàm xử lý khi người dùng click vào một thông báo
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      const socket = getSocket();
      socket.emit('markNotificationAsRead', {
        notificationId: notification.id,
        idUser
      });
    }
    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = () => {
    const socket = getSocket();
    socket.emit('markAllNotificationsAsRead', { idUser });
  };

  const renderNotificationContent = (notification) => {
    const message = getNotificationMessage(notification);
    const { icon, color } = getNotificationIcon(notification.type);

    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10">
          <img
            src={notification.senderAvatar || '/default-avatar.png'}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{notification.senderName}</span>{' '}
            {message.description}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(notification.timestamp, {
              addSuffix: true,
              locale: vi
            })}
          </p>
        </div>
        <div className={`flex-shrink-0 ${color}`}>
          {icon}
          {!notification.read && (
            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  if (selectedNotification) {
    return (
      <NotificationDetailUI
        notification={selectedNotification}
        onBack={() => setSelectedNotification(null)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold">Thông báo</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                {unreadCount} mới
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 mb-4 text-gray-400">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v1a3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">Chưa có thông báo nào</p>
              <p className="mt-1 text-sm text-gray-500">Bạn sẽ nhận được thông báo khi có hoạt động mới</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                {renderNotificationContent(notification)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsUI;
