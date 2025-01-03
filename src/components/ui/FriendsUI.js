import React, { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaUserFriends,
  FaUserClock,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import {
  getSuggestedFriends,
  getFriendRequests,
  respondToFriendRequest,
  sendFriendRequest,
  getFriendsList,
} from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_URL = "https://dacs2-server-8.onrender.com";
const FriendsUI = () => {
  const [activeTab, setActiveTab] = useState("friends"); // 'requests' or 'suggestions'
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadFriendsData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const [requestsData, suggestionsData] = await Promise.all([
          getFriendRequests(),
          getSuggestedFriends(),
        ]);

        console.log("Friend requests data:", requestsData);

        if (!Array.isArray(suggestionsData)) {
          throw new Error("Invalid suggestions data");
        }
        setFriendRequests(requestsData);
        setSuggestedFriends(suggestionsData);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error loading friends data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFriendsData();
  }, [user]);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const handleFriendRequest = async (requester_id, accept) => {
    try {
      setIsLoading(true);

      //Cập nhật lại danh sách lời mời
      setFriendRequests((prev) => {
        const updatedRequests = prev.filter(
          (request) => request.requester_id !== requester_id
        );
        return updatedRequests;
      });

      // Gọi API xử lý phản hồi
      await respondToFriendRequest(requester_id, accept);

      // Hiển thị thông báo thành công
      if (accept) {
        toast.success("Đã chấp nhận lời mời kết bạn thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.info("Đã từ chối lời mời kết bạn!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý lời mời kết bạn:", error);
      toast.error(
        accept
          ? "Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại sau."
          : "Không thể từ chối lời mời kết bạn. Vui lòng thử lại sau.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddFriend = async (userId) => {
    try {
      if (!user) {
        setError("Vui lòng đăng nhập để thực hiện chức năng này");
        return;
      }
      console.log("Sending friend request with:", {
        userId,
        requesterId: user.idUser,
      });
      // Gọi API để gửi lời mời kết bạn với requesterId
      await sendFriendRequest(userId, user.idUser);
      // Cập nhật lại danh sách gợi ý kết bạn
      const updatedSuggestions = await getSuggestedFriends();
      setSuggestedFriends(updatedSuggestions);
    } catch (error) {
      console.error(
        "Error sending friend request:",
        error.response?.data || error.message || error
      );
      setError(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi gửi lời mời kết bạn. Vui lòng thử lại sau."
      );
    }
  };
  const renderFriendRequests = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Lời mời kết bạn</h3>
      {!friendRequests || friendRequests.length === 0 ? (
        <p className="text-gray-500 text-center">
          Không có lời mời kết bạn nào
        </p>
      ) : (
        friendRequests.map((request) => {
          // Thêm log để debug
          console.log("Request data:", request);

          return (
            <div
              key={request.id}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <img
                src={
                  request.avatar
                    ? `${API_URL}${request.avatar}`
                    : "/default-avatar.png"
                }
                alt={request.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-grow">
                <h4 className="font-medium">{request.fullName}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleFriendRequest(request.requester_id, true)
                    }
                    disabled={isLoading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg 
                        ${
                          !isLoading
                            ? "hover:bg-blue-600"
                            : "opacity-75 cursor-not-allowed"
                        }
                        text-sm flex items-center transition-colors`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      <>
                        <FaCheck className="mr-2" />
                        Chấp nhận
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleFriendRequest(request.requester_id, false)
                    }
                    disabled={isLoading}
                    className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
                        ${
                          !isLoading
                            ? "hover:bg-gray-300"
                            : "opacity-75 cursor-not-allowed"
                        }
                        text-sm flex items-center transition-colors`}
                  >
                    {!isLoading && <FaTimes className="mr-2" />}
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
  console.log(suggestedFriends, "suggestedFriends");

  const renderSuggestedFriends = () => {
    if (isLoading) {
      return (
        <div className="text-center py-4 text-gray-500">
          Đang tải gợi ý kết bạn...
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    if (!suggestedFriends || suggestedFriends.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          Không có gợi ý kết bạn nào.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {suggestedFriends?.[0].map((friend) => (
          <div
            key={friend.idUser}
            className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  friend?.avatar
                    ? `${API_URL}${friend.avatar}`
                    : "/default-avatar.png"
                }
                alt={`${friend.fullName || "User"}`}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">
                  {friend.fullName || "Người dùng"}
                </h3>
                <p className="text-sm text-gray-600">
                  {friend.birthday
                    ? `Sinh nhật: ${new Date(
                        friend.birthday
                      ).toLocaleDateString()}`
                    : "Chưa có thông tin sinh nhật"}
                </p>
                <p className="text-sm text-gray-600">
                  {friend.mutual_friends_count} bạn chung
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddFriend(friend.idUser)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
                >
                  <FaUserPlus className="text-sm" />
                  Kết bạn
                </button>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  Bỏ qua
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-full relative">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "requests"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          <div className="flex items-center justify-center">
            <FaUserClock className="mr-2" />
            Lời mời kết bạn
          </div>
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "suggestions"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("suggestions")}
        >
          <div className="flex items-center justify-center">
            <FaUserFriends className="mr-2" />
            Gợi ý kết bạn
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div
        className="p-4 overflow-y-auto"
        style={{ height: "calc(100% - 49px)" }}
      >
        {activeTab === "requests" && renderFriendRequests()}
        {activeTab === "suggestions" && renderSuggestedFriends()}
      </div>
    </div>
  );
};

export default FriendsUI;
