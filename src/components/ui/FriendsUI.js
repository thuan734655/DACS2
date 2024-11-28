import React, { useState } from 'react';
import { FaUserPlus, FaUserFriends, FaUserClock, FaTimes, FaCheck } from 'react-icons/fa';

const FriendsUI = () => {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'suggestions'

  // Mock data for friend requests
  const friendRequests = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user1',
      mutualFriends: 5
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user2',
      mutualFriends: 3
    }
  ];

  // Mock data for suggested friends
  const suggestedFriends = [
    {
      id: 3,
      name: 'Lê Văn C',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user3',
      mutualFriends: 8,
      occupation: 'Developer tại Tech Corp'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user4',
      mutualFriends: 6,
      occupation: 'Designer tại Creative Studio'
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=user5',
      mutualFriends: 4,
      occupation: 'Student tại University'
    }
  ];

  const handleFriendRequest = (userId, accept) => {
    // Handle friend request acceptance/rejection
    console.log(`Friend request ${accept ? 'accepted' : 'rejected'} for user ${userId}`);
  };

  const handleAddFriend = (userId) => {
    // Handle sending friend request
    console.log(`Friend request sent to user ${userId}`);
  };

  const renderFriendRequests = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Lời mời kết bạn</h3>
      {friendRequests.length === 0 ? (
        <p className="text-gray-500 text-center">Không có lời mời kết bạn nào</p>
      ) : (
        friendRequests.map(request => (
          <div key={request.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <img
              src={request.avatar}
              alt={request.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-grow">
              <h4 className="font-medium">{request.name}</h4>
              <p className="text-sm text-gray-500">{request.mutualFriends} bạn chung</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleFriendRequest(request.id, true)}
                  className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center"
                >
                  <FaCheck className="mr-1" />
                  Chấp nhận
                </button>
                <button
                  onClick={() => handleFriendRequest(request.id, false)}
                  className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSuggestedFriends = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Những người bạn có thể biết</h3>
      {suggestedFriends.map(friend => (
        <div key={friend.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-grow">
            <h4 className="font-medium">{friend.name}</h4>
            <p className="text-sm text-gray-500">{friend.occupation}</p>
            <p className="text-sm text-gray-500">{friend.mutualFriends} bạn chung</p>
            <button
              onClick={() => handleAddFriend(friend.id)}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center w-fit"
            >
              <FaUserPlus className="mr-1" />
              Thêm bạn bè
            </button>
          </div>
        </div>
      ))}
    </div>
  );

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
