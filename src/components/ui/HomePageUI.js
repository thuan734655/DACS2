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
  FaBars,
} from "react-icons/fa";
import socket from "../../services/socket";
import { useUserPublicProfile } from "../../hooks/useUserPublicProfile";
import { useNavigate } from "react-router-dom";
const API_URL = "https://dacs2-server-8.onrender.com";
const HomePageUI = () => {
  const navigate = useNavigate();
  const [formCreatePostVisible, setFormCreatePostVisible] = useState(false);
  const [listPosts, setListPosts] = useState(() => {
    const cachedPosts = localStorage.getItem("cachedPosts");
    return cachedPosts ? JSON.parse(cachedPosts) : {};
  });
  const [lastCacheTime, setLastCacheTime] = useState(() => {
    return localStorage.getItem("lastCacheTime") || 0;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedChat, setSelectedChat] = useState(null);
  const [friendCount, setFriendCount] = useState(0);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.idUser || ""
  );
  const [listNotification, setListNotification] = useState([]);
  const [page, setPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [fetchedPostIds, setFetchedPostIds] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const postsContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useUserPublicProfile();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { id: "home", icon: FaHome, label: "Trang chủ" },
    { id: "notifications", icon: FaBell, label: "Thông báo" },
    { id: "messages", icon: FaEnvelope, label: "Tin nhắn" },
    { id: "friends", icon: FaUserFriends, label: "Kết bạn" },
  ];

  const loadPosts = useCallback(
    (pageToLoad = 1) => {
      if (isLoading || (!hasMore && pageToLoad !== 1)) return;

      setIsLoading(true);
      setError(null);

      // Reset states if loading first page
      if (pageToLoad === 1) {
        setListPosts({});
        setFetchedPostIds([]);
        setHasMore(true);
        setIsFirstLoad(true);
      }

      socket.emit("getPosts", idUser, fetchedPostIds, postsPerPage, pageToLoad);
    },
    [idUser, fetchedPostIds, isLoading, hasMore, postsPerPage]
  );

  const handleScroll = useCallback(() => {
    if (!postsContainerRef.current || isLoading || !hasMore || isLoadingMore)
      return;

    const container = postsContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Calculate scroll percentage
    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;

    // Load more when scrolled past 80%
    if (scrollPercentage > 80 && !isLoading && hasMore) {
      setPage((prev) => prev + 1);
      setIsLoadingMore(true);
      loadPosts(page + 1);
    }
  }, [loadPosts, page, isLoading, hasMore, isLoadingMore]);

  useEffect(() => {
    const postsContainer = postsContainerRef.current;
    if (postsContainer) {
      postsContainer.addEventListener("scroll", handleScroll);
      return () => postsContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

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

  useEffect(() => {
    socket.on("receivePosts", ({ posts, hasMorePosts }) => {
      console.log("receivePosts", hasMorePosts);
      setListPosts((prevPosts) => {
        const newPosts = isFirstLoad ? posts : { ...prevPosts, ...posts };
        return newPosts;
      });

      setFetchedPostIds((prev) => [...prev, ...Object.keys(posts)]);
      setHasMore(hasMorePosts);
      setIsLoading(false);
      setIsLoadingMore(false);
      setInitialLoadComplete(true);
      setIsFirstLoad(false);
    });

    return () => {
      socket.off("receivePosts");
    };
  }, [isFirstLoad]);

  useEffect(() => {
    if (!initialLoadComplete && user) {
      loadPosts(1);
    }
  }, [loadPosts, initialLoadComplete, user]);

  useEffect(() => {
    socket.on("receiveNewPost", ({ post }) => {
      console.log("????????????");
      if (!post) return;

      setListPosts((prevPosts) => {
        console.log("receiveNewPost", prevPosts);
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

        return {
          [postId]: newPosts[postId],
          ...prevPosts,
        };
      });
    });

    return () => {
      socket.off("receiveNewPost");
    };
  }, []);

  useEffect(() => {
    socket.on("postUpdated", ({ postId, updatedPost }) => {
      setListPosts((prevPosts) => {
        const newPosts = { ...prevPosts };
        if (newPosts[postId]) {
          newPosts[postId] = {
            ...newPosts[postId],
            post: {
              ...newPosts[postId].post,
              ...updatedPost,
            },
          };
          localStorage.setItem("cachedPosts", JSON.stringify(newPosts));
          localStorage.setItem("lastCacheTime", Date.now().toString());
        }
        return newPosts;
      });
    });

    return () => {
      socket.off("postUpdated");
    };
  }, []);

  useEffect(() => {
    if (Object.keys(listPosts).length > 0) {
      localStorage.setItem("cachedPosts", JSON.stringify(listPosts));
      localStorage.setItem("lastCacheTime", Date.now().toString());
    }
  }, [listPosts]);

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

  const renderLeftPanel = () => {
    if (!user) {
      return <p>No user data found.</p>;
    }

    return (
      <div>
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 hidden md:block">
          <div
            className="flex items-center space-x-4 mb-4"
            onClick={() => navigate(`/profile/${user.idUser}`)}
          >
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
                {currentUser?.fullName || "Đang tải..."}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <button
            onClick={() => setFormCreatePostVisible(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100 mb-4"
          >
            <FaPen className="text-blue-500 text-xl" />
            <span className="font-medium">Tạo bài viết mới</span>
          </button>

          <div className="md:hidden mb-4">
            <button
              onClick={toggleMobileMenu}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100"
            >
              <span className="font-medium">Menu</span>
              <FaBars className="text-blue-500 text-xl" />
            </button>
          </div>

          <nav
            className={`space-y-4 ${
              isMobileMenuOpen ? "block" : "hidden md:block"
            }`}
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="text-blue-500 text-xl" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
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
            {isLoading && isFirstLoad ? (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                Có lỗi xảy ra: {error}
              </div>
            ) : Object.keys(listPosts).length === 0 ? (
              <div className="text-center py-4">Chưa có bài viết nào</div>
            ) : (
              <div className="space-y-4" id="posts-section">
                {Object.entries(listPosts)
                  .sort(([, a], [, b]) => b.post.createdAt - a.post.createdAt)
                  .slice(0, page * postsPerPage)
                  .map(([postId, postData]) => {
                    if (!postData || !postData.post) return null;
                    return (
                      <SocialPost
                        key={postId}
                        postId={postData.post.postId || postId}
                        groupedLikes={postData.groupedLikes}
                        commentCountDefault={postData.commentCount}
                        post={postData.post}
                        postUser={postData.infoUserList[postData.post.idUser]}
                        currentUser={user}
                      />
                    );
                  })}

                {isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}

                {!hasMore && Object.keys(listPosts).length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Đã hiển thị tất cả bài viết
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
      <HeaderUI isAdmin={user.isAdmin} />
      <div className="grid grid-cols-12 gap-4 px-2 py-6 h-full">
        <div className="col-span-12 md:col-span-3 pt-10 overflow-y-auto">
          {renderLeftPanel()}
        </div>

        <div
          className="col-span-12 md:col-span-6 pt-10 h-full overflow-y-auto"
          ref={postsContainerRef}
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HomePageUI;
