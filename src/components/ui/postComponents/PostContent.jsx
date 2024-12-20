import React, { useState, useEffect } from "react";
import MediaPreview from "./MediaPreview";
import { X, MoreHorizontal, Globe, Users, Lock } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import socket from "../../../services/socket.js";
import { menu } from "@material-tailwind/react";

function PostContent({ post, isComment = false, onClose }) {
  const [showMenu, setShowMenu] = useState(false);
  const [contentReport, setContentReport] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const { showToast } = useToast();
  const [privacy, setPrivacy] = useState(post.privacy);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleResponse = (data) => {
      if (data.success) {
        showToast("Báo cáo bài viết thành công!", "success");
      } else {
        showToast("Lỗi khi báo cáo bài viết!", "error");
      }
    };

    const handlePrivacyPost = ({ privacy, success }) => {
      setShowMenu(false);
      if (success) {
        showToast("Đã thay đổi quyền riêng tư bài viết thành công!", "success");
        setPrivacy(privacy);
      } else {
        showToast("Lỗi khi thay đổi quyền riêng tư bài viết!", "error");
      }
    };

    socket.on("responseReportPost", handleResponse);
    socket.on("responsePrivacyPost", handlePrivacyPost);

    return () => {
      socket.off("responseReportPost", handleResponse);
      socket.off("responsePrivacyPost", handlePrivacyPost);
    };
  }, [showToast]);

  const predefinedReasons = [
    "Nội dung không phù hợp",
    "Spam hoặc lừa đảo",
    "Bài viết chứa thông tin sai lệch",
    "Nội dung bạo lực hoặc xúc phạm",
  ];

  if (!post) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return "Không có thời gian";
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Không có thời gian";
    }
  };

  const getPrivacyIcon = (privacy) => {
    console.log(privacy, post);
    switch (privacy) {
      case "public":
        return <Globe className="h-4 w-4 text-gray-500" />;
      case "friends":
        return <Users className="h-4 w-4 text-gray-500" />;
      case "private":
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };
  const handlePrivacyPost = (newPrivacy) => {
    setShowMenu(false);
    socket.emit("SetPrivacyPost", {
      postId: post.postId,
      privacy: newPrivacy,
      idUser: user.idUser,
    });
    setShowPrivacyDialog(false);
  };
  const handleReport = (postId) => {
    const reason = contentReport || selectedReason;

    if (!reason) {
      showToast("Vui lòng chọn hoặc nhập lý do báo cáo!", "error");
      return;
    }

    const content = {
      reason: reason,
      type: "POST",
      postId: postId,
    };

    socket.emit("report", content);

    setShowReportDialog(false);
    setContentReport("");
    setSelectedReason("");
  };

  const renderSharedContent = () => {
    if (!post.sharedPostContent) return null;

    return (
      <div className="mt-4 border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center mb-2">
          <img
            src={
              post.sharedPostContent.originalUser?.avatar ||
              "/default-avatar.png"
            }
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
            color: post.sharedPostContent.textColor || "black",
          }}
        >
          <p className="whitespace-pre-wrap mb-4">
            {post.sharedPostContent.text}
          </p>
          {post.sharedPostContent.mediaUrls &&
            post.sharedPostContent.mediaUrls.length > 0 && (
              <MediaPreview mediaUrls={post.sharedPostContent.mediaUrls} />
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.fullName || "User"}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold">{user?.fullName || "User"}</h3>
            <div className="flex items-center text-sm text-gray-500">
              {!isComment && post.isShared && (
                <p>
                  Đã chia sẻ lúc: {formatDate(post.sharedAt || post.createdAt)}
                </p>
              )}
              {!isComment && !post.isShared && (
                <p>
                  Đã đăng lúc: {formatDate(post.createdAt || post.sharedAt)}
                </p>
              )}
              <span className="mx-1">·</span>
              <div className="flex items-center">
                {getPrivacyIcon(privacy)}
                <span className="ml-1 capitalize">{privacy}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
                <button
                  onClick={() => setShowReportDialog(true)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Báo cáo bài viết
                </button>
                {user.idUser === post.idUser && (
                  <button
                    onClick={() => setShowPrivacyDialog(true)}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Chỉnh sửa quyền riêng tư
                  </button>
                )}
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div
        className="rounded-lg"
        style={{
          backgroundColor: post.isShared
            ? "white"
            : post.backgroundColor || "white",
          color: post.isShared ? "black" : post.textColor || "black",
        }}
      >
        {post.text && <p className="whitespace-pre-wrap mb-4">{post.text}</p>}

        {!post.isShared && post.mediaUrls && post.mediaUrls.length > 0 && (
          <MediaPreview mediaUrls={post.mediaUrls} />
        )}

        {post.isShared && renderSharedContent()}
      </div>

      {showReportDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Báo cáo bài viết</h2>
            <div className="mb-4">
              <p className="font-medium">Chọn lý do:</p>
              <ul>
                {predefinedReasons.map((reason) => (
                  <li key={reason} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="mr-2"
                      />
                      {reason}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p className="font-medium">Hoặc nhập lý do khác:</p>
              <textarea
                value={contentReport}
                onChange={(e) => setContentReport(e.target.value)}
                placeholder="Nhập lý do của bạn"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowReportDialog(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                Hủy
              </button>
              <button
                onClick={() => handleReport(post.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
      {showPrivacyDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Chỉnh sửa quyền riêng tư
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => handlePrivacyPost("public")}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="h-5 w-5 mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Công khai</p>
                  <p className="text-sm text-gray-500">
                    Mọi người đều có thể xem
                  </p>
                </div>
              </button>
              <button
                onClick={() => handlePrivacyPost("friends")}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5 mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Bạn bè</p>
                  <p className="text-sm text-gray-500">
                    Chỉ bạn bè mới có thể xem
                  </p>
                </div>
              </button>
              <button
                onClick={() => handlePrivacyPost("private")}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Lock className="h-5 w-5 mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Chỉ mình tôi</p>
                  <p className="text-sm text-gray-500">
                    Chỉ bạn mới có thể xem
                  </p>
                </div>
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPrivacyDialog(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostContent;
