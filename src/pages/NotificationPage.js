import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Share2, UserPlus, UserCheck } from 'lucide-react';
import { subscribeToNotifications } from '../services/notificationSocket';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.idUser) {
      subscribeToNotifications(user.idUser, {
        onNotificationsList: (notificationsList) => {
          setNotifications(notificationsList);
        },
        onNewNotification: (notification) => {
          setNotifications(prev => [notification, ...prev]);
        },
        onNotificationRead: (notificationId) => {
          setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
          );
        },
        onAllNotificationsRead: () => {
          setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
          );
        }
      });
    }
  }, [user?.idUser]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="w-5 h-5 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-purple-500" />;
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-orange-500" />;
      case 'friend_accept':
        return <UserCheck className="w-5 h-5 text-teal-500" />;
      default:
        return null;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  const getNotificationMessage = (notification) => {
    const { type, data } = notification;
    switch (type) {
      case 'like':
        return `${data.userName} đã thích bài viết của bạn`;
      case 'comment':
        return `${data.userName} đã bình luận về bài viết của bạn`;
      case 'share':
        return `${data.userName} đã chia sẻ bài viết của bạn`;
      case 'friend_request':
        return `${data.requesterName} muốn kết bạn với bạn`;
      case 'friend_accept':
        return `${data.accepterName} đã chấp nhận lời mời kết bạn của bạn`;
      default:
        return 'Bạn có thông báo mới';
    }
  };

  const handleNotificationClick = (notification) => {
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'share':
        window.location.href = `/post/${notification.data.postId}`;
        break;
      case 'friend_request':
        window.location.href = `/profile/${notification.data.requesterId}`;
        break;
      case 'friend_accept':
        window.location.href = `/profile/${notification.data.accepterId}`;
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Thông báo</h1>
      <div className="bg-white rounded-lg shadow">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có thông báo nào
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`flex items-center gap-4 p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-gray-800">
                  {getNotificationMessage(notification)}
                </p>
                <span className="text-sm text-gray-500">
                  {getTimeAgo(notification.timestamp)}
                </span>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
