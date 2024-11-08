import React, { useState, useRef } from 'react';
import { Video, Image as ImageIcon, Smile, Send, X, Upload } from 'lucide-react';

const FormCreatePostUI = () => {
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageForm, setShowImageForm] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim() || image) {
      // Here you would typically send the post and image to your backend
      console.log('Submitting post:', postContent);
      console.log('Image:', image);
      alert('Post created successfully!'); // Replace with your preferred notification method
      setPostContent('');
      setImage(null);
      setImagePreview(null);
      setShowImageForm(false);
    } else {
      alert('Post content or image is required.'); // Replace with your preferred notification method
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 mb-4 max-w-2xl mx-auto">
      <div className="flex items-start space-x-4 mb-4">
        <img
          src="https://github.com/shadcn.png"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <textarea
          placeholder="Phi ơi, bạn đang nghĩ gì thế?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="flex-grow resize-none border rounded-lg p-2"
          rows={3}
        />
      </div>

      {imagePreview && (
        <div className="relative mb-4">
          <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg" />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showImageForm && !imagePreview && (
        <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center pt-2 border-t border-gray-200">
        <div className="flex space-x-2 sm:space-x-4">
          <button type="button" className="flex items-center text-red-500 hover:bg-red-100 p-2 rounded-lg">
            <Video className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Video trực tiếp</span>
          </button>
          <button
            type="button"
            className="flex items-center text-green-500 hover:bg-green-100 p-2 rounded-lg"
            onClick={() => setShowImageForm(!showImageForm)}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Ảnh/video</span>
          </button>
          <button type="button" className="flex items-center text-yellow-500 hover:bg-yellow-100 p-2 rounded-lg">
            <Smile className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Cảm xúc/hoạt động</span>
          </button>
        </div>
        <button type="submit" className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <Send className="mr-2 h-4 w-4 inline" />
          Đăng
        </button>
      </div>
    </form>
  );
};

export default FormCreatePostUI;