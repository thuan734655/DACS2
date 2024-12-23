import { useEffect, useState } from "react";
import { X, Image } from "lucide-react";

import socket from "../../services/socket";
const API_URL = "https://dacs2-server-7.onrender.com";
const FromCreatePost = ({ setFormCreatePostVisible }) => {
  const [postText, setPostText] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [textColor, setTextColor] = useState("#000000");

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const [user, setUser] = useState(null);

  const [privacy, setPrivacy] = useState("public");

  const handleClose = () => {
    setFormCreatePostVisible(false);

    setPostText("");

    setSelectedFiles([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const filesWithPreview = files.map((file) => ({
      file,

      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
  };

  const handlePost = async () => {
    if (!postText.trim()) return;

    const infoUser = localStorage.getItem("user");

    const parsedInfoUser = JSON.parse(infoUser);

    const idUser = parsedInfoUser.idUser;

    setIsLoading(true);

    try {
      // Convert files to base64 with file info

      const mediaPromises = selectedFiles.map(async (fileData) => {
        return new Promise((resolve) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve({
              name: fileData.file.name,

              type: fileData.file.type,

              data: reader.result,
            });
          };

          reader.readAsDataURL(fileData.file);
        });
      });

      const mediaFiles = await Promise.all(mediaPromises);

      const timestamp = Date.now();

      const postId = timestamp.toString();

      // Create post data with proper structure

      const postData = {
        id: postId,

        postId: postId,

        text: postText,

        idUser: idUser,

        textColor: textColor,

        backgroundColor: backgroundColor,

        listFileUrl: mediaFiles,

        comments: [],

        createdAt: timestamp,

        toggle: false, // Initialize toggle state

        groupedLikes: [],

        commentCount: 0,

        privacy: privacy,
      };

      // Emit post data through WebSocket

      socket.emit("newPost", {
        post: postData,

        infoUserList: {
          [idUser]: parsedInfoUser,
        },
      });

      handleClose();
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Lấy dữ liệu từ localStorage

    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-[500px] shadow-xl">
        <div className="relative border-b p-4">
          <h1 className="text-xl font-semibold text-center">Tạo bài viết</h1>

          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}

        <div className="p-4 flex items-center gap-2">
          <img
            src={
              user?.avatar
                ? `${API_URL}${user.avatar}`
                : "https://via.placeholder.com/40"
            }
            alt=""
            className="w-10 h-10 rounded-full"
          />

          <div>
            <div className="font-semibold">
              {user?.fullName || "Loading..."}
            </div>

            <select
              id="privacy"
              name="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="mt-1 text-sm bg-gray-100 border-0 rounded-md py-1 px-3 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="public">🌎 Công khai</option>

              <option value="friends">👥 Bạn bè</option>

              <option value="private">🔒 Chỉ mình tôi</option>
            </select>
          </div>
        </div>

        {/* Post Input */}

        <div className="p-4">
          <textarea
            placeholder="Bạn đang nghĩ gì thế?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            style={{ color: textColor, backgroundColor }}
            className="w-full min-h-[150px] text-lg resize-none outline-none border rounded-md p-2"
          />
        </div>

        {/* Color Options */}

        <div className="p-4 flex gap-4">
          <div>
            <label>Màu chữ: </label>

            <input
              className="cursor-pointer"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>

          <div>
            <label>Màu nền: </label>

            <input
              className="cursor-pointer"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
        </div>

        {/* Media Upload Area */}

        <div className="mx-4 border rounded-lg p-4">
          <div className="text-center">
            <div className="font-semibold">Thêm ảnh/video</div>

            <div className="text-sm text-gray-500">Kéo/Thả</div>

            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2 cursor-pointer"
            >
              <Image className="h-6 w-6" />
            </label>

            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
          </div>

          {/* Preview selected files */}

          {selectedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {selectedFiles.map((fileData, index) => (
                <div key={index} className="relative">
                  {fileData.file.type.startsWith("image/") ? (
                    <img
                      src={fileData.preview}
                      alt="Preview"
                      className="object-cover w-full h-20 rounded-md"
                    />
                  ) : (
                    <video
                      src={fileData.preview}
                      className="object-cover w-full h-20 rounded-md"
                      controls
                    />
                  )}

                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Button */}

        <div className="p-4">
          <button
            onClick={handlePost}
            disabled={!postText.trim() || isLoading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md font-semibold

                       disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8H4z"
                  />
                </svg>
                Đang tạo bài viết, vui lòng chờ ...
              </span>
            ) : (
              "Đăng"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FromCreatePost;
