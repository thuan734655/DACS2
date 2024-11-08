import React, { useState } from 'react';
import { FaVideo, FaPhotoVideo, FaSmile } from 'react-icons/fa';
import FormCreatePostUI from './FormCreatePostUI';
const CreatePost = () => {
  const [showForm , setShowFrom] = useState(false);
  const handleOpenForm = () =>{
    setShowFrom(true);
  }
  const handleCloseForm = () =>{
    setShowFrom(false);
  }
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
      <div className="flex justify-between items-center pt-2 border-t">
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
          <FaVideo className="text-red-500" size={20} />
          <span className="text-gray-600">Video trực tiếp</span>
        </div>

        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg" onClick={handleOpenForm}>
          <FaPhotoVideo className="text-green-500" size={20} />
          <span className="text-gray-600">Ảnh/video</span>
        </div>

        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
          <FaSmile className="text-yellow-500" size={20} />
          <span className="text-gray-600">Cảm xúc/hoạt động</span>
        </div>
      </div>
      {showForm && (
        <>
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <FormCreatePostUI />
              <button
                onClick={handleCloseForm}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-70 z-40"
            onClick={handleCloseForm}
          ></div>
        </>
      )}
    </div>
  );
};

export default CreatePost;
