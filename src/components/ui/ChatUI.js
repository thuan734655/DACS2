import React, { useState, useEffect, useRef } from 'react';
import { FaVideo, FaPhone, FaFile, FaSmile, FaPaperPlane, FaTimes, FaDownload } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { sendMessage, subscribeToChat } from '../../services/ChatService';
import VideoCallService from '../../services/VideoCallService';
import VideoCall from '../VideoCall';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from '../../config/firebaseConfig';

const db = getDatabase(app);

const ChatUI = ({ chat, onClose }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const fileInputRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [isInCall, setIsInCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentUser?.idUser || !chat?.id) return;
   
    const unsubscribe = subscribeToChat(
      currentUser.idUser,
      chat.id,
      (newMessages) => {
        setMessages(newMessages.map(msg => ({
          id: msg.id,
          sender: msg.senderId,
          text: msg.message,
          fileData: msg.fileData,
          fileInfo: msg.fileInfo,
          type: msg.type,
          time: new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isSender: msg.senderId === currentUser.idUser
        })));
      }
    );

    return () => unsubscribe();
  }, [chat.id, currentUser?.idUser]);

  const handleSendMessage = async () => {
    if ((message.trim() || fileInputRef.current?.files[0]) && currentUser?.idUser) {
      try {
        await sendMessage(
          currentUser.idUser, 
          chat.id, 
          message.trim(),
          fileInputRef.current?.files[0]
        );
        setMessage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File không được vượt quá 10MB');
        fileInputRef.current.value = '';
        return;
      }
      handleSendMessage();
    }
  };

  const handleFileDownload = (fileData, fileName) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleVideoCall = async () => {
    try {
      if (!currentUser?.idUser || !chat?.id) return;

      const stream = await VideoCallService.initializeCall(currentUser.idUser, chat.id);
      setLocalStream(stream);

      VideoCallService.onRemoteStream = (stream) => {
        setRemoteStream(stream);
      };

      await VideoCallService.makeCall(currentUser.idUser, chat.id);
      setIsInCall(true);
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Không thể bắt đầu cuộc gọi video. Vui lòng thử lại.');
    }
  };

  const handleEndCall = async () => {
    try {
      if (!currentUser?.idUser || !chat?.id) return;

      await VideoCallService.endCall(currentUser.idUser, chat.id);
      setIsInCall(false);
      setLocalStream(null);
      setRemoteStream(null);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser?.idUser || !chat?.id) return;

    const callRef = ref(db, `calls/${chat.id}_${currentUser.idUser}/offer`);
    const unsubscribe = onValue(callRef, async (snapshot) => {
      const offer = snapshot.val();
      if (offer && !isInCall) {
        const confirmCall = window.confirm(`${chat.user} đang gọi video cho bạn. Bạn có muốn trả lời?`);
        if (confirmCall) {
          try {
            const stream = await VideoCallService.initializeCall(currentUser.idUser, chat.id);
            setLocalStream(stream);

            VideoCallService.onRemoteStream = (stream) => {
              setRemoteStream(stream);
            };

            await VideoCallService.answerCall(currentUser.idUser, chat.id);
            setIsInCall(true);
          } catch (error) {
            console.error('Error answering call:', error);
            alert('Không thể trả lời cuộc gọi. Vui lòng thử lại.');
          }
        } else {
          await VideoCallService.endCall(currentUser.idUser, chat.id);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [chat.id, chat.user, isInCall]);

  const renderMessageContent = (msg) => {
    if (msg.type === 'file') {
      const isImage = msg.fileInfo?.type.startsWith('image/');
      
      if (isImage) {
        return (
          <img 
            src={msg.fileData} 
            alt="" 
            className="max-w-full rounded-lg cursor-pointer"
            style={{ maxHeight: '300px' }}
            onClick={() => handleFileDownload(msg.fileData, msg.fileInfo.name)}
          />
        );
      }

      return (
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
          <FaFile className="text-gray-500 text-xl" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">{msg.fileInfo.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(msg.fileInfo.size)}</p>
          </div>
          <button 
            onClick={() => handleFileDownload(msg.fileData, msg.fileInfo.name)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaDownload className="text-blue-500" />
          </button>
        </div>
      );
    }

    return <p>{msg.text}</p>;
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
          <div className="hidden sm:block">
            <h3 className="font-semibold">{chat.user}</h3>
            <p className="text-sm text-gray-500">
              {chat.online ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaPhone className="text-blue-500" />
          </button>
          <button 
            onClick={handleVideoCall}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaVideo className="text-blue-500" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaTimes className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[70%] sm:max-w-[60%] ${
                msg.isSender
                  ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg'
                  : 'bg-gray-100 rounded-r-lg rounded-tl-lg'
              } p-3`}
            >
              {renderMessageContent(msg)}
              <span className={`text-xs ${msg.isSender ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-0 sm:left-auto">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaSmile className="text-gray-500" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaFile className="text-gray-500" />
          </button>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:border-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>

      {isInCall && (
        <VideoCall
          localStream={localStream}
          remoteStream={remoteStream}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
};

export default ChatUI;