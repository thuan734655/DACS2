import React, { useState } from "react";
import Logo from "../../assets/imgs/Logo.png";

const HeaderUI = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white shadow-md py-2 px-8 flex flex-1
     justify-between items-center fixed w-full z-10">
  <div className="flex items-center space-x-4 pl-32"> 
    <img src={Logo} alt="Logo" className="w-10 h-10" />
    
  </div>

  <div className="flex space-x-4 mx-8"> 
    
  </div>
  <div className="relative pr-24 mr-20">
      <input
        type="text"
        placeholder="Tìm kiếm trên mạng xã hội"
        className="bg-gray-100 rounded-full py-2 px-4 pl-10 w-[700px] focus:outline-none"
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
  <div className="flex items-center space-x-4 pr-20 " > 
    <div className="relative">
      <img
        src="https://via.placeholder.com/150"
        alt="Profile"
        className="rounded-full w-10 h-10 cursor-pointer"
        onClick={toggleMenu}
      />

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
          <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
            Thông tin cá nhân
          </a>
          <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">
            Cài đặt
          </a>
          <a href="/login" className="block px-4 py-2 hover:bg-gray-100">
            Đăng xuất
          </a>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default HeaderUI;
