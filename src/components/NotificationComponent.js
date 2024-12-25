import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationSocket";
import "./NotificationComponent.css";
const API_URL = "http://localhost:5000";
const NotificationComponent = ({ notifications, unreadCount, userId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(userId, notification.id);
    }
    navigateToContent(notification);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(userId);
  };

  const navigateToContent = (notification) => {
    switch (notification.type) {
      case "like":
      case "comment":
        window.location.href = `/post/${notification.data.postId}`;
        break;
      case "friend_request":
        window.location.href = `/profile/${notification.data.requesterId}`;
        break;
      case "friend_accept":
        window.location.href = `/profile/${notification.data.accepterId}`;
        break;
      default:
        break;
    }
    setShowDropdown(false);
  };

  const getNotificationMessage = (notification) => {
    const { type, data } = notification;
    switch (type) {
      case "like":
        return `${data.userName} đã thích bài viết của bạn`;
      case "comment":
        return `${data.userName} đã bình luận về bài viết của bạn`;
      case "friend_request":
        return `${data.requesterName} đã gửi lời mời kết bạn`;
      case "friend_accept":
        return `${data.accepterName} đã chấp nhận lời mời kết bạn của bạn`;
      default:
        return "Bạn có thông báo mới";
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-read">
                Đánh dấu tất cả là đã đọc
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">Không có thông báo nào</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <img
                    src={
                      notification.data.userAvatar
                        ? `${API_URL}${notification.data.userAvatar}`
                        : "/default-avatar.png"
                    }
                    alt="avatar"
                    className="notification-avatar"
                  />
                  <div className="notification-content">
                    <p className="notification-message">
                      {getNotificationMessage(notification)}
                    </p>
                    <span className="notification-time">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.read && <div className="unread-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
