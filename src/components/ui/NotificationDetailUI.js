import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getNotificationMessage, getNotificationIcon, getReactionEmoji } from '../../services/notificationService';

const NotificationDetailUI = ({ notification, onBack }) => {
  const message = getNotificationMessage(notification);
  const { icon, color } = getNotificationIcon(notification.type);

  const renderNotificationContent = () => {
    const { type, data } = notification;

    switch (type) {
      case 'like':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getReactionEmoji(data.emoji)}</span>
              <span className="text-gray-600">{message.title}</span>
            </div>
            {data.postImage && (
              <img
                src={data.postImage}
                alt="Post content"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            {data.postTitle && (
              <p className="text-gray-700 font-medium">{data.postTitle}</p>
            )}
          </div>
        );

      case 'comment':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{message.title}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{data.content}</p>
            </div>
            {data.postTitle && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Bài viết gốc:</p>
                <p className="text-gray-700 font-medium">{data.postTitle}</p>
              </div>
            )}
          </div>
        );

      case 'share':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔄</span>
              <p className="text-gray-600">{message.title}</p>
            </div>
            
            {data.shareText && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 italic">"{data.shareText}"</p>
              </div>
            )}
            
            <div className="border rounded-lg p-4 space-y-3">
              {data.postImage && (
                <img
                  src={data.postImage}
                  alt="Shared post"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              {data.postTitle && (
                <div>
                  <p className="text-sm text-gray-500">Bài viết gốc:</p>
                  <p className="text-gray-700 font-medium">{data.postTitle}</p>
                </div>
              )}
              <div className="flex justify-end">
                <button 
                  onClick={() => window.location.href = `/post/${notification.relatedId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Xem bài viết gốc
                </button>
              </div>
            </div>
          </div>
        );

      case 'friend_request':
      case 'friend_accept':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{message.title}</p>
            <div className="flex items-center space-x-4">
              <img
                src={notification.senderAvatar || '/default-avatar.png'}
                alt={notification.senderName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{notification.senderName}</p>
                {type === 'friend_request' && (
                  <div className="mt-2 space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Chấp nhận
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'mention':
      case 'post_tag':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{message.title}</p>
            {data.preview && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{data.preview}</p>
              </div>
            )}
            {data.postTitle && (
              <p className="text-gray-700 font-medium">{data.postTitle}</p>
            )}
          </div>
        );

      case 'group_invite':
      case 'group_accept':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">{message.title}</p>
            {data.groupName && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Nhóm: {data.groupName}</p>
                {type === 'group_invite' && (
                  <div className="mt-4 space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Tham gia nhóm
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return <p className="text-gray-600">{message.title}</p>;
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Chi tiết thông báo</h1>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={notification.senderAvatar || '/default-avatar.png'}
              alt={notification.senderName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium">{notification.senderName}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(notification.timestamp, {
                  addSuffix: true,
                  locale: vi,
                })}
              </p>
            </div>
            <div className={`text-2xl ${color}`}>{icon}</div>
          </div>

          {renderNotificationContent()}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailUI;
