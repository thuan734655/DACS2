import React, { useState, useEffect } from "react";
import Logo from "../../assets/imgs/Logo.png";
import { LogOut, User } from "lucide-react";
import NotificationComponent from "../NotificationComponent";
import { Link } from 'react-router-dom';
import { subscribeToNotifications } from '../../services/notificationSocket';

const HeaderUI = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.idUser) {
      subscribeToNotifications(user.idUser, {
        onNotificationsList: (notificationsList) => {
          setNotifications(notificationsList);
          const unread = notificationsList.filter(n => !n.read).length;
          setUnreadCount(unread);
        },
        onNewNotification: (notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        },
        onNotificationRead: (notificationId) => {
          setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
          );
          setUnreadCount(prev => Math.max(0, prev - 1));
        },
        onAllNotificationsRead: () => {
          setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
          );
          setUnreadCount(0);
        }
      });
    }
  }, [user?.idUser]);

  return (
    <div className="bg-white shadow-md py-2 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo bên trái */}
        <div className="w-32 "> 
          <img src={Logo} alt="Logo" className="w-10 h-10 " />
        </div>

        {/* Thanh tìm kiếm ở giữa */}
        <div className="flex-1 max-w-2xl px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm trên mạng xã hội"
              className="bg-gray-100 rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path 
                fillRule="evenodd"
                d="M12.9 14.32a7 7 0 111.42-1.42l4.77 4.77a1 1 0 11-1.42 1.42l-4.77-4.77zM9 14a5 5 0 100-10 5 5 0 000 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Icons bên phải */}
        <div className="w-60 flex justify-end space-x-4 pl-42"> 
          {user && (
            <Link to="/notifications" className="relative">
              <NotificationComponent 
                notifications={notifications}
                unreadCount={unreadCount}
                userId={user.idUser}
              />
            </Link>
          )}
          <button 
            className="p-2 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 transition-colors duration-200" 
            title="Hồ sơ"
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 transition-colors duration-200" 
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderUI;
