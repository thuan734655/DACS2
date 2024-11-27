import React from 'react';
import { FaHeart, FaComment, FaUserPlus, FaShare, FaTimes } from 'react-icons/fa';

const NotificationsUI = ({ onClose }) => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'Nguyễn Văn A',
      content: 'đã thích bài viết của bạn',
      time: '5 phút trước',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user1',
      isRead: false
    },
    {
      id: 2,
      type: 'comment',
      user: 'Trần Thị B',
      content: 'đã bình luận về bài viết của bạn',
      time: '10 phút trước',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user2',
      isRead: true
    },
    {
      id: 3,
      type: 'friend',
      user: 'Lê Văn C',
      content: 'đã gửi lời mời kết bạn',
      time: '1 giờ trước',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user3',
      isRead: false
    },
    {
      id: 4,
      type: 'share',
      user: 'Phạm Thị D',
      content: 'đã chia sẻ bài viết của bạn',
      time: '2 giờ trước',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user4',
      isRead: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'friend':
        return <FaUserPlus className="text-green-500" />;
      case 'share':
        return <FaShare className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-full">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Thông báo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer flex items-start space-x-3 ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex-shrink-0">
              <img
                src={notification.avatar}
                alt={notification.user}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{notification.user}</span>
                {getNotificationIcon(notification.type)}
              </div>
              <p className="text-gray-600">{notification.content}</p>
              <span className="text-gray-400 text-sm">{notification.time}</span>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsUI;
