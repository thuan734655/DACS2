import React, { useEffect, useState } from "react";
import {

  FaUserFriends,

  FaUsers,

  FaClock,

  FaBookmark,

  FaVideo,

  FaStore,

  FaNewspaper,

} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {

    // Lấy dữ liệu từ localStorage

    const userData = localStorage.getItem("user");

    if (userData) {

      setUser(JSON.parse(userData)); // Cập nhật state

    }

  }, []);



  // Render giao diện

  if (!user) {

    return <p>No user data found.</p>;

  }

  return (

    <div className="w-70 h-0 ">

      {/* Profile Section */}

      <div

        className="flex items-center space-x-3 mb-4 hover:bg-gray-200"

        onClick={() => navigate("/profile")}

      >

        <img

          src={user.avatar}

          alt="Profile"

          className="rounded-full w-10 h-10"

        />

        <span className="font-semibold text-gray-700">{user.fullName}</span>

      </div>



      {/* Menu Items */}

      <ul className="space-y-3">

        <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

          <FaUserFriends className="text-blue-600" size={20} />

          <span>Bạn bè</span>

        </li>

        <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

          <FaUsers className="text-blue-600" size={20} />

          <span>Nhóm</span>

        </li>

        <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

          <FaClock className="text-blue-600" size={20} />

          <span>Kỷ niệm</span>

        </li>

        <li className="flex items-center space-x-3 cursor-pointe hover:bg-gray-200  p-2 rounded-lg">

          <FaBookmark className="text-purple-600" size={20} />

          <span>Đã lưu</span>

        </li>

        <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

          <FaVideo className="text-blue-600" size={20} />

          <span>Video</span>

        </li>

        <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

          <FaStore className="text-blue-600" size={20} />

          <span>Marketplace</span>

        </li>

        <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

          <FaNewspaper className="text-blue-600" size={20} />

          <span>Bảng feed</span>

        </li>

      </ul>



      {/* Show More */}

      <div className="mt-4">

        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-gray-200 p-2 rounded-lg w-full">

          <span>Xem thêm</span>

        </button>

      </div>



      {/* Favorites Section */}

      <div className="mt-4">

        <h3 className="text-gray-500 font-semibold">Lối tắt của bạn</h3>

        <ul className="space-y-3 mt-2">

          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

            <img

              src="https://via.placeholder.com/40"

              alt="Favorite 1"

              className="w-8 h-8 rounded-full"

            />

            <span>DỊCH VỤ TRA CỨU THÔNG TIN</span>

          </li>

          <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">

            <img

              src="https://via.placeholder.com/40"

              alt="Favorite 2"

              className="w-8 h-8 rounded-full"

            />

            <span>TỰ HỌC ĐÀN GUITAR - PIANO</span>

          </li>

        </ul>

      </div>

    </div>

  );

};



export default Sidebar;

