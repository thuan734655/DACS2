import React, { useEffect, useState } from "react";
import { FaHome, FaUsers, FaBell } from "react-icons/fa";
import { IoApps } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import Logo from "../../assets/imgs/Logo.png";
import { useNavigate } from "react-router-dom";
const HeaderUI = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white shadow-md py-2 px-8 flex justify-between items-center fixed w-full z-10">
      <div className="flex items-center space-x-10">
        <img src={Logo} alt="Logo" className="w-10 h-10" />
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm trên mạng xã hội"
            className="bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none w-64"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.9 14.32a7 7 0 111.42-1.42l4.77 4.77a1 1 0 11-1.42 1.42l-4.77-4.77zM9 14a5 5 0 100-10 5 5 0 000 10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="flex space-x-20 mx-8">
        <FaHome className="text-gray-600 hover:text-pink-300" size={28} />
        <FaUsers className="text-gray-600 hover:text-pink-300" size={28} />
      </div>

      {/* Phần bên phải */}
      <div className="flex items-center space-x-8">
        <IoApps className="text-gray-600 hover:text-pink-300" size={28} />
        <AiFillMessage
          className="text-gray-600 hover:text-pink-300"
          size={28}
          onClick={()=>navigate("/messages")}
        />
        <FaBell className="text-gray-600 hover:text-pink-300" size={28} />

        <div className="relative">
          <img
            src={user.avatar}
            alt="Profile"
            className="rounded-full w-10 h-10 cursor-pointer"
            onClick={toggleMenu}
            
          />

          {/* Menu đổ xuống */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
              <a href="/login" className="block px-4 py-2 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderUI;
