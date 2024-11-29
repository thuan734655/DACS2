import React from "react";
import MediaPreview from "./MediaPreview";
import { X } from "lucide-react";

function PostContent({ post, user, isComment = false, onClose }) {
  if (!post) return null;
console.log(post, "postContent")
  const formatDate = (timestamp) => {
    if (!timestamp) return "Không có thời gian";
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Không có thời gian";
    }
  };

  const renderSharedContent = () => {
    if (!post.sharedPostContent) return null;

    return (
      <div className="mt-4 border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center mb-2">
          <img
            src={post.sharedPostContent.originalUser?.avatar || "/default-avatar.png"}
            alt={post.sharedPostContent.originalUser?.fullName || "User"}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <span className="font-semibold">
              {post.sharedPostContent.originalUser?.fullName || "User"}
            </span>
            {!isComment && (
              <p className="text-xs text-gray-500">
                Đã đăng lúc: {formatDate(post.createdAt)}
              </p>
            )}
          </div>
        </div>
        <div 
          className="p-4 rounded-lg" 
          style={{
            backgroundColor: post.sharedPostContent.backgroundColor || "white",
            color: post.sharedPostContent.textColor || "black"
          }}
        >
          <p className="whitespace-pre-wrap mb-4">{post.sharedPostContent.text}</p>
          {post.sharedPostContent.mediaUrls && post.sharedPostContent.mediaUrls.length > 0 && (
            <MediaPreview mediaUrls={post.sharedPostContent.mediaUrls} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.fullName || "User"}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold">{user?.fullName || "User"}</h3>
            {!isComment && post.isShared && (
              <div className="text-sm text-gray-500">
                <p>Đã chia sẻ lúc: {formatDate(post.sharedAt || post.createdAt)}</p>
              </div>
            )}
            {!isComment && !post.isShared && (
              <p className="text-sm text-gray-500">
                Đã đăng lúc: {formatDate(post.createdAt || post.sharedAt)}
              </p>
            )}
          </div>
        </div>
        {isComment && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      <div 
        className="rounded-lg" 
        style={{
          backgroundColor: post.isShared ? "white" : (post.backgroundColor || "white"),
          color: post.isShared ? "black" : (post.textColor || "black")
        }}
      >
        {post.text && (
          <p className="whitespace-pre-wrap mb-4">{post.text}</p>
        )}
        
        {!post.isShared && post.mediaUrls && post.mediaUrls.length > 0 && (
          <MediaPreview mediaUrls={post.mediaUrls} />
        )}

        {post.isShared && renderSharedContent()}
      </div>
    </div>
  );
}

export default PostContent;
