import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaUserPlus, FaShare } from 'react-icons/fa';
import NotificationDetailUI from './NotificationDetailUI';

const NotificationsUI = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'POST_LIKE',
      title: 'Lượt thích mới',
      content: 'Nguyễn Văn A đã thích bài viết của bạn',
      createdAt: '2024-01-20T08:00:00Z',
      isRead: false,
      relatedId: 'post123'
    },
    {
      id: 2,
      type: 'POST_COMMENT',
      title: 'Bình luận mới',
      content: 'Trần Thị B đã bình luận về bài viết của bạn',
      createdAt: '2024-01-20T07:30:00Z',
      isRead: true,
      relatedId: 'post456'
    },
    {
      id: 3,
      type: 'FRIEND_REQUEST',
      title: 'Lời mời kết bạn',
      content: 'Lê Văn C muốn kết bạn với bạn',
      createdAt: '2024-01-19T15:45:00Z',
      isRead: false,
      relatedId: 'user789'
    },
    {
      id: 4,
      type: 'POST_SHARE',
      title: 'Chia sẻ bài viết',
      content: 'Phạm Thị D đã chia sẻ bài viết của bạn',
      createdAt: '2024-01-19T14:20:00Z',
      isRead: true,
      relatedId: 'post789'
    },
    {
      id: 5,
      type: 'FRIEND_ACCEPT',
      title: 'Chấp nhận kết bạn',
      content: 'Hoàng Văn E đã chấp nhận lời mời kết bạn của bạn',
      createdAt: '2024-01-19T10:15:00Z',
      isRead: false,
      relatedId: 'user101'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <FaThumbsUp className="text-blue-500" />;
      case 'POST_COMMENT':
        return <FaComment className="text-green-500" />;
      case 'POST_SHARE':
        return <FaShare className="text-purple-500" />;
      case 'FRIEND_REQUEST':
      case 'FRIEND_ACCEPT':
        return <FaUserPlus className="text-blue-500" />;
      default:
        return null;
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  if (selectedNotification) {
    return (
      <NotificationDetailUI
        notification={selectedNotification}
        onBack={() => setSelectedNotification(null)}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-6">Thông báo</h2>
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'border-l-4 border-blue-500' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <h3 className={`font-semibold ${!notification.isRead ? 'text-black' : 'text-gray-600'}`}>
                    {notification.title}
                  </h3>
                  <p className={`${!notification.isRead ? 'text-gray-800' : 'text-gray-500'}`}>
                    {notification.content}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {new Date(notification.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsUI;
