import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaComment, FaUserPlus, FaShare } from 'react-icons/fa';
import NotificationDetailUI from './NotificationDetailUI';
import socket from '../../services/socket';

const NotificationsUI = ({ user, data }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState(data.notifications || []);
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.idUser || ""
  );

  // Hàm nhận và xử lý thông báo từ socket
  useEffect(() => {
    // Lắng nghe sự kiện thông báo mới từ server
    const getNotifications = () => {
      socket.emit('getNotifications', { idUser });

      socket.on('notifications', ({ notifications }) => {
        if (Array.isArray(notifications)) {
          setNotifications(notifications); // Cập nhật lại thông báo
        } else {
          console.error('Dữ liệu không phải là mảng:', notifications);
        }
      });

      // Lắng nghe sự kiện thông báo mới và thêm vào danh sách
      socket.on('notification', (notification) => {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      });
    };

    getNotifications();

    // Cleanup để hủy lắng nghe sự kiện khi component unmount
    return () => {
      socket.off('notifications');
      socket.off('notification');
    };
  }, [idUser]);

  // Hàm lấy biểu tượng cho từng loại thông báo
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

  // Hàm xử lý khi người dùng click vào một thông báo
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  // Nếu có thông báo được chọn, hiển thị chi tiết thông báo
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
          {notifications.length === 0 ? (
            <p>Không có thông báo nào.</p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {getNotificationIcon(notification.type)} {/* Hiển thị biểu tượng */}
                  </div>
                  <div className="flex-grow">
                    <h3 className={`font-semibold ${!notification.read ? 'text-black' : 'text-gray-600'}`}>
                      {notification.data.postTitle || 'Tiêu đề bài viết'} {/* Hiển thị tiêu đề */}
                    </h3>
                    <p className={`${!notification.read ? 'text-gray-800' : 'text-gray-500'}`}>
                      {notification.data.shareText || 'Nội dung chia sẻ'} {/* Hiển thị nội dung chia sẻ */}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(notification.timestamp).toLocaleString('vi-VN')} {/* Thời gian thông báo */}
                    </p>
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
