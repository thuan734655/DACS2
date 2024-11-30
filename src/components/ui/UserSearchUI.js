import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import { searchUsersByName, sendFriendRequest, getSuggestedFriends } from '../../services/userService';
import { toast } from 'react-toastify';

const UserSearchUI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu user từ localStorage khi component mount
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const loadSuggestedFriends = async () => {
      try {
        const suggestions = await getSuggestedFriends();
        if (!Array.isArray(suggestions)) {
          throw new Error("Invalid suggestions data");
        }
        setSuggestedFriends(suggestions);
      } catch (error) {
        console.error("Error loading suggested friends:", error);
        setError("Không thể tải gợi ý kết bạn. Vui lòng thử lại sau.");
      }
    };

    if (user) {
      loadSuggestedFriends();
    }
  }, [user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsersByName(searchTerm.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      toast.error('Không thể tìm kiếm người dùng');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      if (!user) {
        setError("Vui lòng đăng nhập để thực hiện chức năng này");
        return;
      }
      
      setIsLoading(true);
      console.log("Sending friend request with:", { userId, requesterId: user.idUser });
      
      await sendFriendRequest(userId, user.idUser);
      
      toast.success('Đã gửi lời mời kết bạn');
      
      // Cập nhật cả searchResults và suggestedFriends
      setSearchResults(prevResults =>
        prevResults.map(userResult =>
          userResult.idUser === userId
            ? { ...userResult, friendRequestSent: true }
            : userResult
        )
      );

      setSuggestedFriends(prevSuggestions =>
        prevSuggestions.map(friend =>
          friend.idUser === userId
            ? { ...friend, friendRequestSent: true }
            : friend
        )
      );

    } catch (error) {
      console.error("Error sending friend request:", error.response?.data || error.message || error);
      
      if (error.response?.data?.message === 'Friend request already exists') {
        toast.info('Lời mời kết bạn đã được gửi trước đó');
        setSearchResults(prevResults =>
          prevResults.map(userResult =>
            userResult.idUser === userId
              ? { ...userResult, friendRequestSent: true }
              : userResult
          )
        );
      } else {
        toast.error("Có lỗi xảy ra khi gửi lời mời kết bạn. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserCard = (user, isSuggestion = false) => (
    <div
      key={user.idUser}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <img
          src={`user.avatar || 'https://api.dicebear.com/6.x/avataaars/svg?seed=${user.idUser}'`}
          alt={user.fullName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-medium text-gray-900">{user.fullName}</h3>
          
          {isSuggestion && user.mutual_friends_count > 0 && (
            <p className="text-sm text-gray-600">{user.mutual_friends_count} bạn chung</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {!user.friendRequestSent ? (
          <button
            onClick={() => handleAddFriend(user.idUser)}
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2
              ${!isLoading ? 'hover:bg-blue-600' : 'opacity-75 cursor-not-allowed'}
              transition-colors duration-200`}
          >
            <FaUserPlus />
            {isLoading ? 'Đang xử lý...' : 'Kết bạn'}
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg flex items-center gap-2 cursor-not-allowed"
          >
            <FaUserPlus />
            Đã gửi lời mời
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm người dùng..."
          className="w-full p-4 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {isSearching ? (
          <div className="text-center py-4">Đang tìm kiếm...</div>
        ) : searchResults.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Kết quả tìm kiếm</h2>
            <div className="space-y-4">
              {searchResults.map(user => renderUserCard(user))}
            </div>
          </div>
        ) : searchTerm.trim() ? (
          <div className="text-center py-4 text-gray-500">
            Không tìm thấy người dùng nào
          </div>
        ) : null}

        {/* Suggested Friends Section */}
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default UserSearchUI;