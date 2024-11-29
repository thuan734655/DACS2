import React, { useState } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const UserSearchUI = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock search results
  const searchUsers = (term) => {
    if (!term) return [];
    return [
      {
        id: 6,
        name: 'Nguyễn Thị F',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user6',
        mutualFriends: 2,
        location: 'Hà Nội, Việt Nam'
      },
      {
        id: 7,
        name: 'Trần Văn G',
        avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user7',
        mutualFriends: 1,
        location: 'Hồ Chí Minh, Việt Nam'
      }
    ].filter(user => 
      user.name.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleAddFriend = (userId) => {
    // Handle sending friend request
    console.log(`Friend request sent to user ${userId}`);
  };

  const results = searchUsers(searchTerm);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold text-lg mb-4">Tìm kiếm người dùng</h3>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Nhập tên người dùng..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      <div className="space-y-4">
        {searchTerm && (
          results.length === 0 ? (
            <p className="text-gray-500 text-center">Không tìm thấy kết quả nào</p>
          ) : (
            results.map(user => (
              <div key={user.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-grow">
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.location}</p>
                  <p className="text-sm text-gray-500">{user.mutualFriends} bạn chung</p>
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center w-fit"
                  >
                    <FaUserPlus className="mr-1" />
                    Thêm bạn bè
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default UserSearchUI;
