import React from "react";
import { FaPhotoVideo, FaSmile } from "react-icons/fa";

const NavCreatePostUI = ({ setFormCreatePostVisible }) => {
  const infoUser = localStorage.getItem("user");
  const parsedInfoUser = infoUser ? JSON.parse(infoUser) : null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {/* Input section */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={parsedInfoUser?.avatar || "/placeholder.svg"}
          alt="Profile"
          className="rounded-full w-10 h-10 object-cover"
        />
        <button
          onClick={() => setFormCreatePostVisible(true)}
          className="bg-gray-100 rounded-full w-full py-2 px-4 text-left text-gray-500 hover:bg-gray-200 transition-colors duration-200"
        >
          {parsedInfoUser?.fullName ? `${parsedInfoUser.fullName} ơi, ` : ""}bạn đang nghĩ gì thế?
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex justify-evenly items-center pt-2 border-t">
        <button
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 flex-1 justify-center"
          onClick={() => setFormCreatePostVisible(true)}
        >
          <FaPhotoVideo className="text-green-500" size={20} />
          <span className="text-gray-600">Ảnh/video</span>
        </button>

        <button
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 flex-1 justify-center"
          onClick={() => setFormCreatePostVisible(true)}
        >
          <FaSmile className="text-yellow-500" size={20} />
          <span className="text-gray-600">Cảm xúc/hoạt động</span>
        </button>
      </div>
    </div>
  );
};

export default NavCreatePostUI;
