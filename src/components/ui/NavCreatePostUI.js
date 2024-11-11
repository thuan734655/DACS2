import React from "react";
import { FaPhotoVideo, FaSmile } from "react-icons/fa";

const NavCreatePostUI = ({ setFormCreatePostVisible }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {/* Input section */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="rounded-full w-10 h-10"
        />
        <input
          type="text"
          placeholder="Phi ơi, bạn đang nghĩ gì thế?"
          className="bg-gray-100 rounded-full w-full py-2 px-4 focus:outline-none"
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-evenly items-center pt-2 border-t">
        <div
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => setFormCreatePostVisible(true)}
        >
          <FaPhotoVideo className="text-green-500" size={20} />
          <span className="text-gray-600">Ảnh/video</span>
        </div>

        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
          <FaSmile className="text-yellow-500" size={20} />
          <span className="text-gray-600">Cảm xúc/hoạt động</span>
        </div>
      </div>
    </div>
  );
};

export default NavCreatePostUI;
