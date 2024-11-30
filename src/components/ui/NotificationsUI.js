import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment, FaUserPlus, FaShare } from 'react-icons/fa';
import NotificationDetailUI from './NotificationDetailUI';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getSocket, initializeSocket } from '../../services/socketService';

const NotificationsUI = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const idUser = JSON.parse(localStorage.getItem('user')).idUser;
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        if (!idUser) {
          throw new Error('User not found');
        }

        // Initialize socket connection
        const socket = getSocket();
        
        // Join notification room
        socket.emit('joinNotificationRoom', {idUser});

        // Listen for notifications list
        socket.on('notificationsList', (notificationsList) => {
          setNotifications(notificationsList.sort((a, b) => b.timestamp - a.timestamp));
          setLoading(false);
        });

        // Listen for new notifications
        socket.on('newNotification', (notification) => {
          setNotifications(prev => [notification, ...prev]);
        });

        // Listen for notification updates
        socket.on('notificationUpdated', (updatedNotification) => {
          setNotifications(prev =>
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        });

        // Handle errors
        socket.on('error', (socketError) => {
          setError(socketError.message);
          setLoading(false);
        });

        // Request initial notifications
        socket.emit('getNotifications', {idUser });

        // Cleanup
        return () => {
          socket.emit('leaveNotificationRoom');
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
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      const socket = getSocket();
      if (socket && idUser) {
        socket.emit('markNotificationAsRead', {
          notificationId: notification.id,
          idUser
        });
      }
    }
    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = () => {
    const socket = getSocket();
    if (socket && idUser) {
      socket.emit('markAllNotificationsAsRead', { idUser });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaThumbsUp className="text-blue-500" />;
      case 'comment':
        return <FaComment className="text-green-500" />;
      case 'share':
        return <FaShare className="text-orange-500" />;
      case 'friend_request':
      case 'friend_accept':
        return <FaUserPlus className="text-purple-500" />;
      default:
        return null;
    }
  };

  const getNotificationContent = (notification) => {
    const { type, data } = notification;
    switch (type) {
      case 'like':
        return `đã thả ${data.emoji || '👍'} cho bài viết của bạn`;
      case 'comment':
        return `đã bình luận về bài viết của bạn: "${data.content}"`;
      case 'share':
        return 'đã chia sẻ bài viết của bạn';
      case 'friend_request':
        return 'đã gửi lời mời kết bạn';
      case 'friend_accept':
        return 'đã chấp nhận lời mời kết bạn';
      default:
        return '';
    }
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
      <div className="flex justify-center items-center h-screen text-red-500">
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
          <h1 className="text-xl font-semibold">Thông báo</h1>
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          )}
        </div>
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Không có thông báo nào
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
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10">
                    <img
                      src={notification.data.userAvatar || '/default-avatar.png'}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{notification.data.userName}</span>{' '}
                      {getNotificationContent(notification)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                        locale: vi
                      })}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    {getNotificationIcon(notification.type)}
                    {!notification.read && (
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsUI;
