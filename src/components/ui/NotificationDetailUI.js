import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaThumbsUp, FaComment, FaUserPlus, FaShare } from 'react-icons/fa';
import SocialPost from './SocialPost';
import { getSocket } from '../../services/socketService';

const NotificationDetailUI = ({ notification, onBack }) => {
  const [relatedContent, setRelatedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const socket = getSocket();
        const idUser = JSON.parse(localStorage.getItem('user')).idUser;

        // Request related content through socket
        socket.emit('getRelatedContent', {
          idUser,
          notificationId: notification.id,
          type: notification.type,
          postId: notification.data.postId
        });

        // Listen for related content response
        const handleRelatedContent = (content) => {
          setRelatedContent(content);
          setIsLoading(false);
        };

        const handleError = (err) => {
          setError(err.message);
          setIsLoading(false);
        };

        socket.on('relatedContent', handleRelatedContent);
        socket.on('error', handleError);

        // Cleanup listeners
        return () => {
          socket.off('relatedContent', handleRelatedContent);
          socket.off('error', handleError);
        };
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchRelatedContent();
  }, [notification]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaThumbsUp className="text-blue-500" />;
      case 'comment':
        return <FaComment className="text-green-500" />;
      case 'share':
        return <FaShare className="text-purple-500" />;
      case 'friend_request':
      case 'friend_accept':
        return <FaUserPlus className="text-blue-500" />;
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold">Chi tiết thông báo</h1>
        </div>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10">
              <img
                src={notification.data.userAvatar || '/default-avatar.png'}
                alt=""
                className="w-full h-full rounded-full"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{notification.data.userName}</span>{' '}
                {getNotificationContent(notification)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.timestamp).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
              {error}
            </div>
          ) : relatedContent && (
            <div className="mt-4">
              <SocialPost post={relatedContent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailUI;
