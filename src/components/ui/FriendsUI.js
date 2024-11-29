import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaUserFriends, FaUserClock, FaTimes, FaCheck } from 'react-icons/fa';
import { getSuggestedFriends, getFriendRequests, respondToFriendRequest, sendFriendRequest } from '../../services/userService';
import { toast } from 'react-toastify';
const FriendsUI = () => {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'suggestions'
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  // Mock data for friend requests
  
  useEffect(() => {
    const loadFriendsData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const [requestsData, suggestionsData] = await Promise.all([
          getFriendRequests(),
          getSuggestedFriends()
        ]);
        
        console.log('Friend requests data:', requestsData);
        
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
    // Lấy dữ liệu từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  const handleFriendRequest = async (requesterId, accept) => {
    try {
      console.log('Handling friend request:', { requesterId, accept });
      
      await respondToFriendRequest(requesterId, accept);
      // Hiển thị thông báo thành công
      toast.success(accept ? "Đã chấp nhận lời mời kết bạn" : "Đã từ chối lời mời kết bạn");
      
      // Cập nhật lại cả danh sách lời mời kết bạn và gợi ý kết bạn
      const [updatedRequests, updatedSuggestions] = await Promise.all([
        getFriendRequests(),
        getSuggestedFriends()
      ]);
      
      console.log('Updated data after response:', {
        requests: updatedRequests,
        suggestions: updatedSuggestions
      });
      
      setFriendRequests(updatedRequests);
      setSuggestedFriends(updatedSuggestions);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xử lý lời mời kết bạn";
      console.error("Error handling friend request:", {
        error: error.response?.data || error.message || error,
        requestData: { requesterId, accept }
      });
      toast.error(errorMessage);
    }
  };
  const handleAddFriend = async (userId) => {
    try {
      if (!user) {
        setError("Vui lòng đăng nhập để thực hiện chức năng này");
        return;
      }
      console.log("Sending friend request with:", { userId, requesterId: user.idUser });
      // Gọi API để gửi lời mời kết bạn với requesterId
      await sendFriendRequest(userId, user.idUser);
      // Cập nhật lại danh sách gợi ý kết bạn
      const updatedSuggestions = await getSuggestedFriends();
      setSuggestedFriends(updatedSuggestions);
    } catch (error) {
      console.error("Error sending friend request:", error.response?.data || error.message || error);
      setError(error.response?.data?.message || "Có lỗi xảy ra khi gửi lời mời kết bạn. Vui lòng thử lại sau.");
    }
  };
  const renderFriendRequests = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Lời mời kết bạn</h3>
      {!friendRequests || friendRequests.length === 0 ? (
        <p className="text-gray-500 text-center">Không có lời mời kết bạn nào</p>
      ) : (
        friendRequests.map(request => {
          // Thêm log để debug
          console.log('Request data:', request);
          
          return (
            <div key={request.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <img
                src={request.avatar || '/default-avatar.png'}
                alt={request.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-grow">
                <h4 className="font-medium">{request.fullName}</h4>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => {
                      // Sử dụng requester_id thay vì requesterId
                      console.log('Accepting request from:', request.requester_id);
                      handleFriendRequest(request.requester_id, true);
                    }}
                    className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center"
                  >
                    <FaCheck className="mr-1" />
                    Chấp nhận
                  </button>
                  <button
                    onClick={() => handleFriendRequest(request.requester_id, false)}
                    className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm flex items-center"
                  >
                    <FaTimes className="mr-1" />
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
console.log(suggestedFriends, 'suggestedFriends');

  const renderSuggestedFriends = () => {
    if (isLoading) {
      return <div className="text-center py-4 text-gray-500">Đang tải gợi ý kết bạn...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    if (!suggestedFriends || suggestedFriends.length === 0) {
      return <div className="text-center py-4 text-gray-500">Không có gợi ý kết bạn nào.</div>;
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
                src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.idUser}`}
                alt={`${friend.fullName || 'User'}`}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">
                  {friend.fullName || "Người dùng"}
                </h3>
                <p className="text-sm text-gray-600">
                  {friend.birthday ? `Sinh nhật: ${new Date(friend.birthday).toLocaleDateString()}` : 'Chưa có thông tin sinh nhật'}
                </p>
                <p className='text-sm text-gray-600'>{friend.mutual_friends_count} bạn chung</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddFriend(friend.idUser)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
                >
                  <FaUserPlus className="text-sm" />
                  Kết bạn
                </button>
                <button
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
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
    <div className="bg-white rounded-lg shadow-lg h-full">
      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'requests'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          <div className="flex items-center justify-center">
            <FaUserClock className="mr-2" />
            Lời mời kết bạn
          </div>
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'suggestions'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('suggestions')}
        >
          <div className="flex items-center justify-center">
            <FaUserFriends className="mr-2" />
            Gợi ý kết bạn
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 49px)' }}>
        {activeTab === 'requests' && renderFriendRequests()}
        {activeTab === 'suggestions' && renderSuggestedFriends()}
      </div>
    </div>
  );
};

export default FriendsUI;
