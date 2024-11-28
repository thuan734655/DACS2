import React, { useEffect, useState } from "react";
import HeaderUI from "./HeaderUI";
import FormCreatePost from "./FormCreatePostUI";
import SocialPost from "./SocialPost";
import NotificationsUI from "./NotificationsUI";
import MessagesUI from "./MessagesUI";
import ChatUI from "./ChatUI";
import FriendsUI from "./FriendsUI";
import UserSearchUI from "./UserSearchUI";
import NavCreatePostUI from "./NavCreatePostUI"; // Import NavCreatePostUI
import { getPosts } from "../../services/postService";
import { getUserProfile, getOnlineFriends, getFriendRequests, respondToFriendRequest } from "../../services/userService";
import { FaBell, FaEnvelope, FaUserFriends, FaHome, FaPen } from 'react-icons/fa';
import socket from "../../services/socket";

const HomePageUI = () => {
  const [formCreatePostVisible, setFormCreatePostVisible] = useState(false);
  const [listPosts, setListPosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChat, setSelectedChat] = useState(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPosts();
      if (response && response.data) {
        console.log(Object.entries(response.data),"hehehe");
        setListPosts(response.data);
      } else {
        setListPosts({});
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const [profileData, onlineFriendsData, friendRequestsData] = await Promise.all([
        getUserProfile(),
        getOnlineFriends(),
        getFriendRequests()
      ]);

      setProfile(profileData);
      setOnlineFriends(onlineFriendsData);
      setFriendRequests(friendRequestsData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
    }
  };

  const handleFriendRequest = async (requestId, accept) => {
    try {
      await respondToFriendRequest(requestId, accept);
      const updatedRequests = await getFriendRequests();
      setFriendRequests(updatedRequests);
    } catch (error) {
      console.error("Lỗi khi xử lý lời mời kết bạn:", error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    loadPosts();
    loadUserData();

    // Listen for new posts
    socket.on("receiveNewPost", ({ post }) => {
      console.log("New post received:", post);
      setListPosts(prevPosts => {
        const newPosts = { ...prevPosts };
        newPosts[post.id] = post;
        return newPosts;
      });
    });

    return () => {
      socket.off("receiveNewPost");
    };
  }, []);

  const renderLeftPanel = () => {
    return (
      <>
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={profile?.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${profile?.username}`}
              alt={profile?.fullName}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-lg">{profile?.fullName || "Đang tải..."}</h2>
              <p className="text-gray-500">@{profile?.username || "..."}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-semibold">{profile?.friends || 0}</div>
              <div className="text-gray-500 text-sm">Bạn bè</div>
            </div>
            <div>
              <div className="font-semibold">{profile?.photos || 0}</div>
              <div className="text-gray-500 text-sm">Ảnh</div>
            </div>
            <div>
              <div className="font-semibold">{profile?.likes || 0}</div>
              <div className="text-gray-500 text-sm">Thích</div>
            </div>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <button
            onClick={() => setFormCreatePostVisible(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100"
          >
            <FaPen className="text-blue-500 text-xl" />
            <span className="font-medium">Tạo bài viết mới</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaHome className="text-blue-500 text-xl" />
              <span className="font-medium">Trang chủ</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaBell className="text-blue-500 text-xl" />
              <span className="font-medium">Thông báo</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaEnvelope className="text-blue-500 text-xl" />
              <span className="font-medium">Tin nhắn</span>
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'friends' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <FaUserFriends className="text-blue-500 text-xl" />
              <span className="font-medium">Kết bạn</span>
            </button>
          </nav>
        </div>
      </>
    );
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {formCreatePostVisible && (
              <FormCreatePost
                setFormCreatePostVisible={setFormCreatePostVisible}
                reloadPosts={loadPosts}
              />
            )}
            {isLoading ? (
              <div className="text-center py-4">Đang tải bài viết...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                Có lỗi xảy ra: {error}
              </div>
            ) : Object.keys(listPosts).length === 0 ? (
              <div className="text-center py-4">Chưa có bài viết nào</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(listPosts).map(([postId, postData]) => {
                  if (!postData || !postData.post) return null;
                  return (
                    <SocialPost
                      key={postId}
                      postId={postData.post.postId}
                      groupedLikes={postData.groupedLikes}
                      commentCountDefault={postData.commentCount}
                      post={postData.post}
                      user={postData.infoUserList[postData.post.idUser]}
                    />
                  );
                })}
              </div>
            )}
          </>
        );
      case 'notifications':
        return <NotificationsUI />;
      case 'messages':
        return selectedChat ? (
          <ChatUI chat={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaEnvelope className="mx-auto text-4xl mb-2" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        );
      case 'friends':
        return <FriendsUI />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <HeaderUI />
      <div className="grid grid-cols-12 gap-4 px-2 py-6 h-full">
        {/* Left Sidebar */}
        <div className="col-span-12 md:col-span-3 pt-10 overflow-y-auto">
          {renderLeftPanel()}
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-6 pt-10 h-full overflow-y-auto">
          {renderMainContent()}
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block md:col-span-3 h-full overflow-y-auto pt-10 space-y-4">
          {activeTab === 'messages' ? (
            <MessagesUI 
              showInRightPanel={true} 
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChat?.id}
            />
          ) : activeTab === 'friends' ? (
            <UserSearchUI />
          ) : (
            <>
              {/* Online Friends */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Bạn bè đang online</h3>
                <div className="space-y-4">
                  {onlineFriends.length === 0 ? (
                    <div className="text-gray-500 text-center">Không có bạn bè nào đang online</div>
                  ) : (
                    onlineFriends.map(friend => (
                      <div key={friend.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={friend.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.username}`}
                            alt={friend.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="font-medium">{friend.name}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Friend Requests */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Lời mời kết bạn</h3>
                <div className="space-y-4">
                  {friendRequests.length === 0 ? (
                    <div className="text-gray-500 text-center">Không có lời mời kết bạn nào</div>
                  ) : (
                    friendRequests.map(request => (
                      <div key={request.id} className="flex items-center space-x-3">
                        <img
                          src={request.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${request.username}`}
                          alt={request.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{request.name}</div>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleFriendRequest(request.id, true)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                              Chấp nhận
                            </button>
                            <button
                              onClick={() => handleFriendRequest(request.id, false)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageUI;
