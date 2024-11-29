import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { socket } from '../../socket';
import { toast } from 'react-toastify';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationSound = useRef(new Audio('/notification-sound.mp3'));
  const notificationRef = useRef(null);

  useEffect(() => {
    if (userId) {
      // Lấy thông báo ban đầu
      socket.emit('getNotifications', { userId });

      // Lắng nghe thông báo mới
      socket.on('notificationsList', (notificationsList) => {
        setNotifications(notificationsList);
        updateUnreadCount(notificationsList);
      });

      socket.on('newNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        notificationSound.current.play();
        updateUnreadCount([notification, ...notifications]);
        
        // Hiển thị toast khi có thông báo mới
        toast.info(getNotificationMessage(notification), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      socket.on('notificationMarkedRead', ({ notificationId }) => {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        updateUnreadCount(notifications);
      });

      socket.on('allNotificationsMarkedRead', () => {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
      });

      // Click outside to close notifications
      const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
          setShowNotifications(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        socket.off('notificationsList');
        socket.off('newNotification');
        socket.off('notificationMarkedRead');
        socket.off('allNotificationsMarkedRead');
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [userId]);

  const getNotificationMessage = (notification) => {
    const { type, data } = notification;
    switch (type) {
      case 'like':
        return `${data.userName} đã thích bài viết của bạn`;
      case 'comment':
        return `${data.userName} đã bình luận về bài viết của bạn`;
      case 'reply':
        return `${data.userName} đã trả lời bình luận của bạn`;
      case 'friend_request':
        return `${data.requesterName} đã gửi lời mời kết bạn`;
      case 'friend_accept':
        return `${data.accepterName} đã chấp nhận lời mời kết bạn của bạn`;
      default:
        return 'Bạn có thông báo mới';
    }
  };

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllRead = () => {
    socket.emit('markAllNotificationsRead', { userId });
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      socket.emit('markNotificationRead', {
        userId,
        notificationId: notification.id
      });
    }
    handleNavigate(notification);
  };

  const handleNavigate = (notification) => {
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'reply':
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
    setShowNotifications(false);
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={toggleNotifications}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Không có thông báo nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;