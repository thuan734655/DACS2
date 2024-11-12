import React from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";

// Avatar Component
function Avatar({ src, fallback, alt }) {
  return (
    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
}

// SocialPost Component
function SocialPost({
  postId,
  post, // Includes attributes like createdAt, mediaUrls, shares, text
  user, // Array containing user information
}) {
  const { createdAt, mediaUrls, shares, text, backgroundColor, textColor } =
    post;
  const { fullName = "Unknown User", avatar = "/placeholder.svg" } =
    user[0] || {}; // User information

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()} - ${date.toLocaleDateString()}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={avatar} alt={fullName} fallback="IT" />
          <div>
            <h2 className="font-semibold text-sm">{fullName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{formatDate(createdAt)}</span>
              <span>•</span>
              <span>🌍</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Content */}
      <div
        className="mt-3 rounded-lg p-4"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        {text}
      </div>

      {/* Media URLs */}
      <div className="mt-3">
        {mediaUrls && mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 content-img">
            {mediaUrls.map((url, index) =>
              url.endsWith(".mp4") ? (
                <video
                  key={index}
                  src={"http://localhost:5000" + url}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <img
                  key={index}
                  src={"http://localhost:5000" + url}
                  alt={`Media ${index}`}
                  className="w-full h-auto rounded-lg"
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <span className="flex items-center">
            👍 😆
            <span className="ml-1">179</span> {/* Temporarily static */}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>36 bình luận</span>
          <span>{shares} lượt chia sẻ</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-3 border-t grid grid-cols-4 gap-1">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ThumbsUp className="h-5 w-5" />
          <span>Thích</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <MessageCircle className="h-5 w-5" />
          <span>Bình luận</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Send className="h-5 w-5" />
          <span>Gửi</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Share2 className="h-5 w-5" />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-start gap-2">
          <Avatar
            src="/placeholder.svg?height=32&width=32"
            alt="Commenter"
            fallback="U"
          />
          <div className="flex-1 bg-gray-100 rounded-lg p-2">
            <p className="font-semibold text-sm">Tran Anh Tien</p>
            <p className="text-sm">R lúc pv technical thì sao bạn?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialPost;
