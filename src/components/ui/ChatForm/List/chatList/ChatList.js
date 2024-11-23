import React, { useState } from "react";
import axios from "axios";
import Search from "../../../../../assets/imgs/search.png";
import Avatar from "../../../../../assets/imgs/avatar.png";

const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Vui lòng nhập tên để tìm kiếm.");
      return;
    }

    try {
      setError(""); // Xóa lỗi trước khi gửi yêu cầu
      const response = await axios.get("http://localhost:7749/api/search-users", {
        params: { name: searchQuery },
      });

      setUsers(response.data); // Cập nhật danh sách người dùng
    } catch (err) {
      console.error("Lỗi khi tìm kiếm người dùng:", err);
      setError("Không thể kết nối với máy chủ hoặc không tìm thấy người dùng.");
    }
  };

  return (
    <div className="flex-1 h-[730px] overflow-y-auto">
      {/* Ô tìm kiếm */}
      <div className="flex items-center gap-5 p-5">
        <div className="flex flex-1 bg-zinc-600 rounded-xl items-center gap-5 p-[9px]">
          <img
            className="w-7 h-7 cursor-pointer"
            src={Search}
            alt="Tìm kiếm"
            onClick={handleSearch}
          />
          <input
            className="bg-transparent border-none outline-none text-white flex-1"
            type="text"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Hiển thị lỗi */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Hiển thị danh sách người dùng */}
      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user.idUser}
            className="flex items-center gap-5 p-5 cursor-pointer border-b-gray-500 border-b boder-b-2"
          >
            <img
              className="w-[50px] h-[50px] rounded-full object-cover"
              src={Avatar}
              alt=""
            />
            <div className="flex flex-col gap-[10]">
              <span className="font-medium">{user.name}</span>
              <p className="text-xs font-normal">{user.email}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">Không có người dùng nào được tìm thấy.</p>
      )}
    </div>
  );
};

export default ChatList;
