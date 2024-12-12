import React, { useEffect, useState } from "react";
import { FaSearch, FaCircle, FaTimes } from "react-icons/fa";
import { getFriendsList } from "../../services/userService";
import socket from "../../services/socket";

const MessagesUI = ({
  onClose,
  showInRightPanel = false,
  onChatSelect,
  selectedChatId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  useEffect(() => {
    const loadFriends = async () => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser.idUser) {
        const friendsList = await getFriendsList(currentUser.idUser);
        setFriends(
          friendsList.map((friend) => ({
            id: friend.idUser,
            user: friend.fullName || "Người dùng",
            avatar:
              friend.avatar ||
              `https://api.dicebear.com/6.x/avataaars/svg?seed=${friend.idUser}`,
            lastMessage: "Nhấn để bắt đầu trò chuyện",
            time: "",
            unread: 0,
            online: onlineUsers.has(friend.idUser),
          }))
        );
      }
    };
    loadFriends();
  }, [onlineUsers]);
  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (currentUser && currentUser.idUser) {
      // Emit sự kiện userConnected khi component mount
      console.log("Emitting userConnected with ID:", currentUser.idUser);
      socket.emit("userConnected", currentUser.idUser);
    }

    // Lắng nghe danh sách users online
    socket.on("getOnlineUsers", (users) => {
      console.log("Received online users:", users);
      setOnlineUsers(new Set(users));
    });

    // Lắng nghe khi có user mới online
    socket.on("userConnected", (userId) => {
      console.log("User connected:", userId);
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    // Lắng nghe khi có user offline
    socket.on("userDisconnected", (userId) => {
      console.log("User disconnected:", userId);
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Cleanup listeners khi component unmount
    return () => {
      if (currentUser && currentUser.idUser) {
        // Thông báo user offline khi unmount
        socket.emit("userDisconnected", currentUser.idUser);
      }
      socket.off("getOnlineUsers");
      socket.off("userConnected");
      socket.off("userDisconnected");
    };
  }, []);
  const handleChatClick = (chat) => {
    if (onChatSelect) {
      onChatSelect(chat);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-2 sm:p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Tin nhắn</h2>
          {!showInRightPanel && onClose && (
            <button
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500 text-sm sm:text-base" />
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tin nhắn..."
            className="w-full pl-8 sm:pl-10 pr-4 py-1 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-2 sm:left-3 top-2 sm:top-3 text-gray-400 text-sm sm:text-base" />
        </div>
      </div>
      <div className="overflow-y-auto flex-grow">
        {friends
          .filter(
            (chat) =>
              (chat.user?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
              ) ||
              (chat.lastMessage?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
              )
          )
          .map((chat, index) => (
            <div
              key={`${chat.idUser}+${index}`}
              className={`p-2 sm:p-4 hover:bg-gray-50 cursor-pointer ${
                selectedChatId === chat.idUser ? "bg-blue-50" : ""
              }`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.user}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0">
                      <FaCircle className="text-green-500 text-xs" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm sm:text-base truncate">{chat.user}</span>
                    <span className="text-gray-400 text-xs sm:text-sm ml-1">{chat.time}</span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
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
