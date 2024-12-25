import React, { useState } from "react";
import Logo from "../../assets/imgs/Logo.png";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchUsersByName } from "../../services/userService";
import { useUserPublicProfile } from "../../hooks/useUserPublicProfile";
const API_URL = "http://localhost:5000";
const HeaderUI = (isAdmin) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { currentUser, reload, currentUserId, isOwner } =
    useUserPublicProfile();
  console.log("44444444444", currentUser);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      try {
        const results = await searchUsersByName(value);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <div className="bg-white shadow-md py-2 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo bên trái */}
        <div className="w-32">
          <img
            src={Logo}
            alt="Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate("/homepage")}
          />
        </div>

        {/* Thanh tìm kiếm ở giữa */}
        <div className="flex-1 max-w-2xl px-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm người dùng theo tên..."
              className="bg-gray-100 rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
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

            {/* Kết quả tìm kiếm */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.idUser}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleResultClick(user.idUser)}
                  >
                    <img
                      src={
                        currentUser.avatar
                          ? `${API_URL}${user.avatar}`
                          : "default-avatar.png"
                      }
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{user.fullName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Icons bên phải */}
        <div className="w-60 flex justify-end space-x-4 pl-42">
          <button
            className="p-2 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 transition-colors duration-200"
            title="Hồ sơ"
            onClick={() => navigate("/profile")}
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
          {isAdmin.isAdmin === 1 && (
            <button
              className="p-2 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 transition-colors duration-200"
              title="Admin Settings"
              onClick={() => navigate("/admin")}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <button
            className="p-2 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 transition-colors duration-200"
            title="Đăng xuất"
            onClick={() => navigate("/login")}
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderUI;
