import React, { useState } from 'react';
import { FaVideo, FaPhone, FaFile, FaSmile, FaPaperPlane, FaTimes } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

const ChatUI = ({ chat, onClose }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: chat.id,
      text: 'Xin chào!',
      time: '10:00',
      isSender: false
    },
    {
      id: 2,
      sender: 'me',
      text: 'Chào bạn!',
      time: '10:01',
      isSender: true
    },
    {
      id: 3,
      sender: chat.id,
      text: 'Bạn khỏe không?',
      time: '10:02',
      isSender: false
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        text: message,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isSender: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        text: `Đã gửi file: ${file.name}`,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isSender: true,
        isFile: true,
        fileName: file.name
      };
      setMessages([...messages, newMessage]);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={chat.avatar}
              alt={chat.user}
              className="w-10 h-10 rounded-full"
            />
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{chat.user}</h3>
            <p className="text-sm text-gray-500">
              {chat.online ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaPhone className="text-blue-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaVideo className="text-blue-500" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] ${
                msg.isSender
                  ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg'
                  : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg'
              } p-3 shadow-sm`}
            >
              {msg.isFile ? (
                <div className="flex items-center space-x-2">
                  <FaFile className="text-lg" />
                  <span>{msg.fileName}</span>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
              <div
                className={`text-xs mt-1 ${
                  msg.isSender ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t relative">
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-0">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            <FaFile className="text-blue-500" />
          </label>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile className="text-blue-500" />
          </button>
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              rows="1"
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
