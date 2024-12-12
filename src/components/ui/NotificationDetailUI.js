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
    }
  };

  return (
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
        ) : (
          renderRelatedContent()
        )}
      </div>
    </div>
  );
};

export default NotificationDetailUI;
