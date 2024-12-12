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

  useEffect(() => {
    if (isPost) {
      socket.on("res_getPostById", (data) => {
        setDataNotification(data);
        setLoad(false);
      });
      socket.emit("getPostById", { postId: notification.postId });
    } else if (isFriendRequest) {
      setLoad(false);
    }
  }, []);

  const getFriendRequestContent = () => {
    const senderName = notification.senderName || 'Người dùng';
    const receiverName = notification.receiverName || 'Người dùng';
    const avatarUrl = notification.senderAvatar || null;
    
    switch (notification.type) {
      case 'FRIEND_REQUEST':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <div className="relative">
              {/* Animation container */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-32">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-blue-200 rounded-full animate-pulse"></div>
              </div>
              
              {/* Profile picture */}
              <div className="relative z-10 flex justify-center mb-6">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={senderName}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <FaUser className="text-4xl text-white" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Lời mời kết bạn mới
                </h2>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                    {senderName}
                  </span>
                  {" "}đã gửi cho bạn một lời mời kết bạn
                </p>
                
                {/* Animated connection line */}
                <div className="relative h-8 my-6">
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
                    <div className="h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded animate-pulse"></div>
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FaUserFriends className="text-2xl text-blue-500 animate-bounce" />
                  </div>
                </div>

              
              </div>
            </div>
          </div>
        );
      
      case 'FRIEND_REQUEST_ACCEPTED':
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

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {isLoad && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            Đang tải...
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
      </div>
    </div>
  );
};

export default NotificationDetailUI;