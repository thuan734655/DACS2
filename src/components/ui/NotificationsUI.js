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

  useEffect(() => {
    const getNotifications = () => {
      socket.emit('getNotifications', { idUser });

      socket.on('notifications', ({ notifications: serverNotifications }) => {
        console.log('Received notifications:', serverNotifications);
        if (Array.isArray(serverNotifications)) {
          const notificationsWithToggle = serverNotifications
            .map(notification => ({
              ...notification,
              toggle: false
            }))
            .sort((a, b) => {
              // Sort by read status first (unread first)
              if (!a.read && b.read) return -1;
              if (a.read && !b.read) return 1;
              // Then sort by date
              return new Date(b.createdAt) - new Date(a.createdAt);
            });

          setNotifications(prevNotifications => {
            const defaultNotifications = prevNotifications.filter(n => n.id.startsWith('default-'));
            const allNotifications = [...notificationsWithToggle, ...defaultNotifications];
            console.log('All notifications:', allNotifications);
            return allNotifications;
          });
        } else {
          console.error('Dữ liệu không phải là mảng:', serverNotifications);
        }
      });

      socket.on('notification', (notification) => {
        console.log('New notification received:', notification);
        setNotifications((prevNotifications) => [{
          ...notification,
          toggle: false,
          read: false
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
      
      // Update local state to mark as read
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
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

  // Show all notifications regardless of tab
  const allNotifications = notifications;
  const unreadCount = allNotifications.filter(n => !n.read).length;
  console.log('Rendering notifications:', allNotifications);

  const getNotificationMessage = (notification) => {
    const { type, senderName, data = {} } = notification;
    const { reaction, postTitle, shareText } = data;
    const postName = postTitle ? `"${postTitle}"` : 'bài viết của bạn';

    // Định dạng nội dung comment để hiển thị ngắn gọn
    const formatCommentText = (text) => {
      if (!text) return '';
      return text.length > 50 ? `${text.substring(0, 50)}...` : text;
    };

    switch (type) {
      case 'POST_REACTION':
        if (reaction === 'like') return `${senderName} đã thích ${postName}`;
        if (reaction === 'love') return `${senderName} đã thả tim ${postName}`;
        if (reaction === 'haha') return `${senderName} cảm thấy hài hước về ${postName}`;
        if (reaction === 'wow') return `${senderName} đã ngạc nhiên về ${postName}`;
        if (reaction === 'sad') return `${senderName} cảm thấy buồn về ${postName}`;
        if (reaction === 'angry') return `${senderName} cảm thấy phẫn nộ về ${postName}`;
        return `${senderName} đã bày tỏ cảm xúc về ${postName}`;

      case 'POST_COMMENT':
        return `${senderName} đã bình luận trong ${postName}`;

      case 'POST_SHARE':
        if (shareText) {
          const formattedShare = formatCommentText(shareText);
          return `${senderName} đã chia sẻ ${postName} và nói "${formattedShare}"`;
        }
        return `${senderName} đã chia sẻ ${postName} lên tường của họ`;

      case 'FRIEND_REQUEST':
        return `${senderName} đã gửi cho bạn một lời mời kết bạn`;

      case 'FRIEND_ACCEPT':
        return `${senderName} đã đồng ý kết bạn với bạn. Các bạn giờ đã là bạn bè!`;

      case 'POST_REPLY_TO_REPLY':
        return `${senderName} đã trả lời bình luận của bạn `;

      case 'POST_REPLY_COMMENT':
        return `${senderName} đã trả lời bình luận của bạn `;

      default:
        const friendlyType = type
          .toLowerCase()
          .replace('post_', '')
          .replace('comment_', '')
          .replace('friend_', '')
          .replace('group_', '')
          .replace('reply_to_', '')
          .replace('_', ' ');
        return `${senderName} đã ${friendlyType} trong ${postName}`;
    }
  };

  return (
    <div className="mx-auto bg-white rounded-xl shadow-lg p-4 w-[90%] max-w-5xl min-h-[400px] transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800">Thông báo</h2>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-sm px-2 py-0.5 rounded-full">
              {unreadCount} chưa đọc
            </span>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FaEllipsisH className="text-gray-500 w-5 h-5" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-1">
        {allNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        ) : (
          allNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer relative transition-all duration-200 transform hover:scale-[1.01] ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Avatar or Icon */}
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center relative shadow-sm">
                {notification.senderAvatar ? (
                  <img
                    src={notification.senderAvatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="p-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                )}
                {!notification.read && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'} line-clamp-2`}>
                  {getNotificationMessage(notification)}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {formatDistanceToNow(new Date(notification.createdAt || Date.now()), {
                    addSuffix: true,
                    locale: vi
                  })}
                </span>

                {/* Friend Request Actions */}
                {notification.type === 'friendRequest' && !notification.read && (
                  <div className="flex gap-2 mt-3">
                    <button
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
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
                      className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
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
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsUI;
