import React, { useState } from 'react';
import { FaSearch, FaCircle, FaTimes } from 'react-icons/fa';
import ChatUI from './ChatUI';

const MessagesUI = ({ onClose, showInRightPanel = false, onChatSelect, selectedChatId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=chat1',
      lastMessage: 'Bạn khỏe không?',
      time: '2 phút trước',
      unread: 2,
      online: true
    },
    {
      id: 2,
      user: 'Trần Thị B',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=chat2',
      lastMessage: 'Hẹn gặp lại nhé!',
      time: '1 giờ trước',
      unread: 0,
      online: false
    },
    {
      id: 3,
      user: 'Lê Văn C',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=chat3',
      lastMessage: 'Ok bạn',
      time: '2 giờ trước',
      unread: 1,
      online: true
    }
  ];

  const handleChatClick = (chat) => {
    if (onChatSelect) {
      onChatSelect(chat);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-full">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tin nhắn</h2>
          {!showInRightPanel && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tin nhắn..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="overflow-y-auto">
        {conversations
          .filter(chat => 
            chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                selectedChatId === chat.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.user}
                    className="w-12 h-12 rounded-full"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0">
                      <FaCircle className="text-green-500 text-xs" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{chat.user}</span>
                    <span className="text-gray-400 text-sm">{chat.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessagesUI;
