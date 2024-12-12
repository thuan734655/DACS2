import React, { useEffect, useState, useCallback, useRef } from "react";
import HeaderUI from "./HeaderUI";
import FormCreatePost from "./FormCreatePostUI";
import SocialPost from "./SocialPost";
import NotificationsUI from "./NotificationsUI";
import MessagesUI from "./MessagesUI";
import ChatUI from "./ChatUI";
import FriendsUI from "./FriendsUI";
import UserSearchUI from "./UserSearchUI";
import {
  getOnlineFriends,
  getFriendRequests,
  getFriendCount,
} from "../../services/userService";
import {
  FaBell,
  FaEnvelope,
  FaUserFriends,
  FaHome,
  FaPen,
} from "react-icons/fa";
import socket from "../../services/socket";
import { useUserPublicProfile } from "../../hooks/useUserPublicProfile";

const API_URL = "http://localhost:5000";
const HomePageUI = () => {
  const [formCreatePostVisible, setFormCreatePostVisible] = useState(false);
  const [listPosts, setListPosts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedChat, setSelectedChat] = useState(null);
  const [friendCount, setFriendCount] = useState(0);
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.idUser || ""
  );
  const [listNotification, setListNotification] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchedPostIds, setFetchedPostIds] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const scrollRef = useRef(null);
  const lastScrollPositionRef = useRef(0); // New ref to store the scroll position

  const { currentUser } = useUserPublicProfile();

  useEffect(() => {
    socket.on("notification", (notification) => {
      if (notification.originPostIdUser === idUser) {
        setListNotification((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
      }
    });

    socket.on("notifications", ({ notifications }) => {
      if (Array.isArray(notifications)) {
        setListNotification(notifications);
      } else {
        console.error("Dữ liệu không phải là mảng:", notifications);
        setListNotification([]);
      }
    });

    return () => {
      socket.off("notification");
      socket.off("notifications");
    };
  }, [idUser]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (activeTab === "notifications") {
      socket.emit("getNotifications", { idUser });
    }
  }, [activeTab, idUser]);

  const loadPosts = useCallback(
    (pageToLoad = 1) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      setError(null);

      // Always store the current scroll position before loading new posts
      lastScrollPositionRef.current = scrollRef.current?.scrollTop || 0;

      socket.emit("getPosts", idUser, fetchedPostIds, 10, pageToLoad);
    },
    [idUser, fetchedPostIds, isLoading, hasMore]
  );

  useEffect(() => {
    const handleReceivePosts = ({ posts, page: receivedPage, hasMore }) => {
      setListPosts((prevPosts) => ({
        ...prevPosts,
        ...posts,
      }));
      setPage(receivedPage);
      setHasMore(hasMore);
      setFetchedPostIds((prevIds) => [...prevIds, ...Object.keys(posts)]);
      setIsLoading(false);
      setInitialLoadComplete(true);

      // Use requestAnimationFrame to ensure the DOM has updated before scrolling
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = lastScrollPositionRef.current;
        }
      });
    };

    const handleError = ({ message }) => {
      setError(message);
      setIsLoading(false);
    };

    socket.on("receivePosts", handleReceivePosts);
    socket.on("error", handleError);

    return () => {
      socket.off("receivePosts", handleReceivePosts);
      socket.off("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (user && !initialLoadComplete) {
      loadPosts();
      loadUserData();
    }
  }, [user, initialLoadComplete, loadPosts]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current && initialLoadComplete) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        !isLoading &&
        hasMore
      ) {
        loadPosts(page + 1);
      }
    }
  }, [loadPosts, page, isLoading, hasMore, initialLoadComplete]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const loadUserData = async () => {
    try {
      const [onlineFriendsData, friendRequestsData, friendCountData] =
        await Promise.all([
          getOnlineFriends(),
          getFriendRequests(),
          getFriendCount(),
        ]);

      setOnlineFriends(onlineFriendsData);
      setFriendRequests(friendRequestsData);
      setFriendCount(friendCountData.count || 0);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    socket.on("receiveNewPost", ({ post }) => {
      if (!post) return;

      setListPosts((prevPosts) => {
        const newPosts = { ...prevPosts };
        const postId = post.postId || Date.now().toString();

        newPosts[postId] = {
          post: {
            ...post,
            toggle: false,
            text: post.text || "",
            textColor: post.textColor || "#000000",
            backgroundColor: post.backgroundColor || "#ffffff",
            listFileUrl: post.listFileUrl || [],
            comments: post.comments || [],
            createdAt: post.createdAt || Date.now(),
          },
          groupedLikes: post.groupedLikes || [],
          commentCount: post.commentCount || 0,
          infoUserList: {
            [post.idUser]: post.infoUserList[post.idUser],
          },
        };

        return newPosts;
      });
    });

    return () => {
      socket.off("receiveNewPost");
    };
  }, []);

  const renderLeftPanel = () => {
    if (!user) {
      return <p>No user data found.</p>;
    }

    return (
      <div>
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={
                currentUser?.avatar
                  ? `${API_URL}${currentUser.avatar}`
                  : `https://api.dicebear.com/6.x/avataaars/svg?seed=${currentUser.fullName}`
              }
              alt={user?.fullName}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-lg">
                {user?.fullName || "Đang tải..."}
              </h2>
              
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-semibold">{friendCount || 0}</div>
              <div className="text-gray-500 text-sm">Bạn bè</div>
            </div>
            <div>
              <div className="font-semibold">{user?.photos || 0}</div>
              <div className="text-gray-500 text-sm">Ảnh</div>
            </div>
            <div>
              <div className="font-semibold">{user?.likes || 0}</div>
              <div className="text-gray-500 text-sm">Thích</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <button
            onClick={() => setFormCreatePostVisible(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100"
          >
            <FaPen className="text-blue-500 text-xl" />
            <span className="font-medium">Tạo bài viết mới</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === "home"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaHome className="text-blue-500 text-xl" />
              <span className="font-medium">Trang chủ</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaBell className="text-blue-500 text-xl" />
              <span className="font-medium">Thông báo</span>
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === "messages"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaEnvelope className="text-blue-500 text-xl" />
              <span className="font-medium">Tin nhắn</span>
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === "friends"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaUserFriends className="text-blue-500 text-xl" />
              <span className="font-medium">Kết bạn</span>
            </button>
          </nav>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (!user) {
      return <p>Please log in to view content.</p>;
    }

    switch (activeTab) {
      case "home":
        return (
          <div>
            {formCreatePostVisible && (
              <FormCreatePost
                setFormCreatePostVisible={setFormCreatePostVisible}
                reloadPosts={loadPosts}
                user={user}
              />
            )}
            {isLoading && page === 1 ? (
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
                      postId={postData.post.postId || postId}
                      groupedLikes={postData.groupedLikes}
                      commentCountDefault={postData.commentCount}
                      post={postData.post}
                      user={postData.infoUserList[postData.post.idUser]}
                      currentUser={user}
                    />
                  );
                })}
                {isLoading && (
                  <div className="text-center py-4">
                    Đang tải thêm bài viết...
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "notifications":
        return <NotificationsUI user={user} data={listNotification} />;
      case "messages":
        return selectedChat ? (
          <ChatUI
            chat={selectedChat}
            onBack={() => setSelectedChat(null)}
            user={user}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaEnvelope className="mx-auto text-4xl mb-2" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        );
      case "friends":
        return <FriendsUI user={user} />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">
          Please log in to access the application.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <HeaderUI user={user} />
      <div className="grid grid-cols-12 gap-4 px-2 py-6 h-full">
        <div className="col-span-12 md:col-span-3 pt-10 overflow-y-auto">
          {renderLeftPanel()}
        </div>

        <div
          ref={scrollRef}
          className="col-span-12 md:col-span-6 pt-10 h-full overflow-y-auto"
        >
          {renderMainContent()}
        </div>

        <div className="hidden md:block md:col-span-3 h-full overflow-y-auto pt-10 space-y-4">
          {activeTab === "messages" ? (
            <MessagesUI
              showInRightPanel={true}
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChat?.id}
              user={user}
            />
          ) : activeTab === "friends" ? (
            <UserSearchUI user={user} />
          ) : (
            <div>
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-lg mb-4">
                  Bạn bè đang online
                </h3>
                <div className="space-y-4">
                  {onlineFriends.length === 0 ? (
                    <div className="text-gray-500 text-center">
                      Không có bạn bè nào đang online
                    </div>
                  ) : (
                    onlineFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="relative">
                          <img
                            src={
                              friend.avatar ||
                              `https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.username}`
                            }
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageUI;
