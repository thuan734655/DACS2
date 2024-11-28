import { useState } from "react";
import { X } from "lucide-react";
import { createPost } from "../../services/postService";

const FromCreatePost = ({ onClose, reloadPosts }) => {
  const [postText, setPostText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const handleClose = () => {
    if (onClose) onClose();
    if (reloadPosts) reloadPosts();
    setPostText("");
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    const infoUser = localStorage.getItem("user");
    const parsedInfoUser = JSON.parse(infoUser);
    const idUser = parsedInfoUser.idUser;

    setIsLoading(true);
    let formData = new FormData();
    formData.append("text", postText);
    formData.append("idUser", idUser);
    formData.append("textColor", textColor);
    formData.append("backgroundColor", backgroundColor);
    formData.append("comments", []);

    try {
      await createPost(formData);
      handleClose();
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-[500px] shadow-2xl transform transition-all">
        <div className="relative border-b p-4">
          <h1 className="text-xl font-semibold text-center">Tạo bài viết</h1>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src="/placeholder.svg"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-[0.95rem]">
              {JSON.parse(localStorage.getItem("user"))?.fullName || "Your Name"}
            </div>
          </div>
        </div>

        {/* Post Input */}
        <div className="px-4 pb-3">
          <textarea
            placeholder="Bạn đang nghĩ gì?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            style={{ color: textColor, backgroundColor }}
            className="w-full min-h-[150px] text-[0.95rem] resize-none outline-none rounded-lg p-3 border border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Color Options */}
        <div className="px-4 pb-4 flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Màu chữ:</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Màu nền:</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t">
          <button
            onClick={handlePost}
            disabled={!postText.trim() || isLoading}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-200 
              ${
                !postText.trim() || isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {isLoading ? "Đang đăng..." : "Đăng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FromCreatePost;
