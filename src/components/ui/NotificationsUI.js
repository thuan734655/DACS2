import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaComment, FaUserPlus, FaShare, FaEllipsisH } from 'react-icons/fa';
import NotificationDetailUI from './NotificationDetailUI';
import socket from '../../services/socket';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationsUI = ({ user, data }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const idUser = user?.idUser;

  // Existing socket logic
  useEffect(() => {
    const getNotifications = () => {
      socket.emit('getNotifications', { idUser });

      socket.on('notifications', ({ notifications: serverNotifications }) => {
        if (Array.isArray(serverNotifications)) {
          const notificationsWithToggle = serverNotifications.map(notification => ({
            ...notification,
            toggle: false
          }));
          setNotifications(prevNotifications => {
            const defaultNotifications = prevNotifications.filter(n => n.id.startsWith('default-'));
            return [...notificationsWithToggle, ...defaultNotifications];
          });
        } else {
          console.error('Dữ liệu không phải là mảng:', serverNotifications);
        }
      });

      socket.on('notification', (notification) => {
        setNotifications((prevNotifications) => [{
          ...notification,
          toggle: false
        }, ...prevNotifications]);
      });
    };

    getNotifications();

    return () => {
      socket.off('notifications');
      socket.off('notification');
    };
  }, [idUser]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'postShared':
        return <FaShare className="text-purple-500" />;
      case 'postLiked':
        return <FaThumbsUp className="text-blue-500" />;
      case 'postComment':
        return <FaComment className="text-green-500" />;
      case 'friendRequest':
      case 'friendAccept':
        return <FaUserPlus className="text-blue-500" />;
      default:
        return null;
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      socket.emit('markNotificationAsRead', {
        notificationId: notification.id,
        idUser
      });
    }
  };

  if (selectedNotification) {
    return (
      <NotificationDetailUI
        notification={selectedNotification}
        onBack={() => setSelectedNotification(null)}
      />
    );
  }

  const filteredNotifications = selectedTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Thông báo</h2>
        <FaEllipsisH className="text-gray-500 cursor-pointer" />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          className={`pb-2 px-2 ${selectedTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('all')}
        >
          Tất cả
        </button>
        <button
          className={`pb-2 px-2 ${selectedTab === 'unread' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('unread')}
        >
          Chưa đọc
        </button>
      </div>

      {/* Previous Notifications Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Trước đó</span>
          <button className="text-sm text-blue-500 hover:underline">
            Xem tất cả
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer relative"
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Avatar or Icon */}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center relative">
                {notification.senderAvatar ? (
                  <img
                    src={notification.senderAvatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getNotificationIcon(notification.type)
                )}
                {!notification.read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  {notification.message || `${notification.senderName} đã ${
                    notification.type === 'postLiked' ? 'thích' :
                    notification.type === 'postComment' ? 'bình luận về' :
                    notification.type === 'postShared' ? 'chia sẻ' :
                    notification.type === 'friendRequest' ? 'gửi lời mời kết bạn' :
                    notification.type === 'friendAccept' ? 'chấp nhận lời mời kết bạn' :
                    'tương tác với'
                  } bài viết của bạn`}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt || Date.now()), {
                    addSuffix: true,
                    locale: vi
                  })}
                </span>

                {/* Friend Request Actions */}
                {notification.type === 'friendRequest' && !notification.read && (
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        socket.emit('acceptFriendRequest', {
                          notificationId: notification.id,
                          userId: idUser,
                          friendId: notification.senderId
                        });
                      }}
                    >
                      Xác nhận
                    </button>
                    <button
                      className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        socket.emit('declineFriendRequest', {
                          notificationId: notification.id,
                          userId: idUser,
                          friendId: notification.senderId
                        });
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsUI;
