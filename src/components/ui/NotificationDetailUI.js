import {React, useState, useEffect} from 'react';
import socket from "../../services/socket";
import SocialPost from './SocialPost';
import { FaArrowLeft, FaUserFriends, FaCheck, FaTimes, FaUserPlus, FaUser } from 'react-icons/fa';

const NotificationDetailUI = ({notification, onBack}) => {
  const user = JSON.parse(localStorage.getItem("user")); 
  const [isPost, setIsPost] = useState( notification.type === 'POST_REACTION' || notification.type === 'POST_COMMENT' ||  notification.type === 'POST_REPLY_COMMENT' || notification.type === 'POST_REPLY_TO_REPLY' ||notification.type === 'POST_SHARE');
  const [isFriendRequest, setIsFriendRequest] = useState(notification.type === 'FRIEND_REQUEST' || notification.type === 'FRIEND_REQUEST_ACCEPTED' || notification.type === 'FRIEND_REQUEST_DENY');
  const [dataNotification, setDataNotification] = useState({});
  const [isLoad, setLoad] = useState(true);
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaThumbsUp, FaComment, FaUserPlus, FaShare } from 'react-icons/fa';
import SocialPost from './SocialPost';

const NotificationDetailUI = ({ notification, onBack }) => {
  const [relatedContent, setRelatedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock function to fetch related content
  const fetchRelatedContent = async (type, id) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data based on notification type
    switch (type) {
      case 'POST_LIKE':
      case 'POST_COMMENT':
      case 'POST_SHARE':
        return {
          type: 'post',
          data: {
            id: 'post123',
            content: 'Đây là nội dung bài viết gốc',
            images: ['https://picsum.photos/seed/post123/600/400'],
            createdAt: '2024-01-20T08:30:00Z',
            user: {
              id: 'user456',
              name: 'Nguyễn Văn A',
              avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user456'
            },
            likes: 42,
            comments: 15,
            shares: 5
          }
        };
      case 'FRIEND_REQUEST':
      case 'FRIEND_ACCEPT':
        return {
          type: 'user',
          data: {
            id: 'user789',
            name: 'Trần Thị B',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user789',
            mutualFriends: 3,
            location: 'Hà Nội, Việt Nam',
            occupation: 'Designer tại Creative Studio'
          }
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    const loadRelatedContent = async () => {
      setIsLoading(true);
      try {
        const content = await fetchRelatedContent(notification.type, notification.relatedId);
        setRelatedContent(content);
      } catch (error) {
        console.error('Error loading related content:', error);
      }
      setIsLoading(false);
    };

    loadRelatedContent();
  }, [notification]);

  const renderIcon = () => {
    switch (notification.type) {
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

  const renderRelatedContent = () => {
    if (!relatedContent) return null;

    switch (relatedContent.type) {
      case 'post':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <div className="relative">
              {/* Success animation container */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-32">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-green-200 rounded-full animate-pulse"></div>
              </div>
              
              {/* Profile pictures */}
              <div className="relative z-10 flex justify-center items-center mb-6">
                {/* First user */}
                <div className="transform -translate-x-4 transition-transform hover:scale-105">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={senderName}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <FaUser className="text-3xl text-white" />
                    </div>
                  )}
                </div>
                
                {/* Connection icon */}
                <div className="z-20 mx-2 bg-white rounded-full p-2 shadow-lg">
                  <FaUserFriends className="text-2xl text-green-500 animate-bounce" />
                </div>
                
                {/* Second user */}
                <div className="transform translate-x-4 transition-transform hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <FaUser className="text-3xl text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Đã trở thành bạn bè
                  </h2>
                  <FaCheck className="text-green-500 text-2xl animate-bounce" />
                </div>
                
                <p className="text-lg text-gray-600">
                  Bạn và {" "}
                  <span className="font-semibold text-green-600 hover:text-green-700 transition-colors cursor-pointer">
                    {senderName}
                  </span>
                  {" "}đã trở thành bạn bè
                </p>
                
                {/* Animated success line */}
                <div className="relative h-8 my-6">
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
                    <div className="h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'FRIEND_REQUEST_DENY':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <div className="relative">
              {/* Deny animation container */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-32">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse"></div>
              </div>
              
              {/* Profile picture */}
              <div className="relative z-10 flex justify-center mb-6">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={senderName}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover filter grayscale"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <FaUser className="text-4xl text-white" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Lời mời kết bạn đã bị từ chối
                  </h2>
                  <FaTimes className="text-red-500 text-2xl animate-bounce" />
                </div>
                
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer">
                    {senderName}
                  </span>
                  {" "}đã từ chối lời mời kết bạn của bạn
                </p>
                
                {/* Animated deny line */}
                <div className="relative h-8 my-6">
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
                    <div className="h-1 bg-gradient-to-r from-red-200 via-red-400 to-red-200 rounded animate-pulse"></div>
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
                    <FaTimes className="text-2xl text-red-500 animate-bounce" />
                  </div>
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">Bài viết liên quan</h3>
            <SocialPost post={relatedContent.data} />
          </div>
        );
      case 'user':
        return (
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">Thông tin người dùng</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <img
                  src={relatedContent.data.avatar}
                  alt={relatedContent.data.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-lg">{relatedContent.data.name}</h4>
                  <p className="text-gray-500">{relatedContent.data.occupation}</p>
                  <p className="text-gray-500">{relatedContent.data.location}</p>
                  <p className="text-gray-500">{relatedContent.data.mutualFriends} bạn chung</p>
                  {notification.type === 'FRIEND_REQUEST' && (
                    <div className="flex space-x-2 mt-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Chấp nhận
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
        return null;
    }
  };

  return (
    <div className="bg-white">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center h-14 px-4">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
            >
              <FaArrowLeft className="text-lg" />
              <span>Quay lại thông báo</span>
            </button>
          </div>
        </div>
      </div>
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Notification Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
              {renderIcon()}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {notification.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {notification.content}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(notification.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        {/* Related Content */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải nội dung liên quan...</p>
          </div>
        )}
        {isPost && !isLoad && (
          <SocialPost 
            postId={dataNotification.post.postId} 
            post={dataNotification.post} 
            user={user} 
            groupedLikes={dataNotification.groupedLikes} 
            commentCountDefault={dataNotification.commentCount}
          />
        )}
        {isFriendRequest && !isLoad && getFriendRequestContent()}
        ) : (
          renderRelatedContent()
        )}
      </div>
    </div>
  );
};

export default NotificationDetailUI;
