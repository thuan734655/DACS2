import React, { useState, useEffect, useCallback } from "react";
import { ThumbsUp, MessageCircle, Send, Share2 } from "lucide-react";
import socket from "../../services/socket";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EmojiPickerComponent from "./postComponents/EmojiPickerComponent";
import PostContent from "./postComponents/PostContent";
import SubPost from "./postComponents/SubPost";

function SocialPost({ postId, post, user, groupedLikes, commentCountDefault }) {
  const [shareCount, setShareCount] = useState(post.shares || 0);
  const [likeCount, setLikeCount] = useState(
    groupedLikes ? Object.values(groupedLikes).flat().length : 0
  );
  const [commentCount, setCommentCount] = useState(
    commentCountDefault ? commentCountDefault : 0
  );

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [emojiChoose, setEmojiChoose] = useState(null);
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.idUser || ""
  );
  const [emojiCounts, setEmojiCounts] = useState(groupedLikes || {});
  const [showSubPost, setShowSubPost] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    socket.on("postShared", ({ postId: sharedPostId, shareCount }) => {
      if (sharedPostId === postId) {
        setShareCount(shareCount);
      }
    });

    return () => {
      socket.off("postShared");
    };
  }, [postId]);

  const handleShare = () => {
    if (!idUser) {
      toast.error('Vui lòng đăng nhập để chia sẻ bài viết!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmShare = () => {
    setShowConfirmDialog(false);
    setIsSharing(true);
    socket.emit("sharePost", { 
      postId,
      idUser,
      shareText 
    });

    toast.success('Đã chia sẻ bài viết thành công!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setShareText("");
    setTimeout(() => setIsSharing(false), 1000);
  };

  const handleOutsideClick = useCallback((e) => {
    if (!e.target.closest(".reaction-picker") && !e.target.closest("button")) {
      setShowReactionPicker(false);
    }
    if (
      !e.target.closest(".emoji-picker-react") &&
      !e.target.closest("button")
    ) {
      setShowReactionPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    const handleReceiveReaction = (data) => {
      if (data.postId === postId) {
        setEmojiCounts(data.groupedLikes);
        setLikeCount(Object.values(data.groupedLikes).flat().length);
        setEmojiChoose(null);
      }
    };

    socket.on("receiveReaction", handleReceiveReaction);

    return () => {
      socket.off("receiveReaction", handleReceiveReaction);
    };
  }, [postId]);

  const handleLike = (emoji) => {
    if (!idUser) {
      console.error("User ID not found");
      return;
    }
    const dataReq = { postId, emoji, idUser };
    socket.emit("newReaction", dataReq);
    setShowReactionPicker(false);
  };

  const renderEmoji = () => {
    if (!emojiCounts) return null;

    let selectedEmoji = emojiChoose;

    const emojiElements = Object.entries(emojiCounts)
      .filter(([emoji, users]) => users.length > 0)
      .map(([emoji, users]) => {
        users.forEach(user => {
          if ((user - '0') == idUser) {
            selectedEmoji = emoji;
          }
        });
        
        return (
          <div
            key={emoji}
            className="flex items-center gap-1 text-sm text-gray-500"
          >
            <span>{emoji}</span>
            <span>{users.length}</span>
          </div>
        );
      });

    if (selectedEmoji !== emojiChoose) {
      setEmojiChoose(selectedEmoji);
    }

    return emojiElements;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4" id={postId}>
      <PostContent post={post} user={user} />
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">{renderEmoji()}</div>
        <div className="flex items-center gap-3">
          <span>{commentCount} bình luận</span>
          <span>{shareCount} lượt chia sẻ</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t grid grid-cols-4 gap-1 relative">
        <div className="relative">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
          >
            <span className="flex gap-2 ">
              {emojiChoose ? (
                emojiChoose
              ) : (
                <React.Fragment>
                  <ThumbsUp className="h-5 w-5" />
                  <span>Thích</span>
                </React.Fragment>
              )}
            </span>
          </button>

          {showReactionPicker && (
            <EmojiPickerComponent
              setShowReactionPicker={setShowReactionPicker}
              handleLike={handleLike}
            />
          )}
        </div>

        <button
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          onClick={() => setShowSubPost((prev) => !prev)}
        >
          <MessageCircle className="h-5 w-5" />
          Bình luận
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Send className="h-5 w-5" />
          Gửi
        </button>

        <button 
          className={`flex items-center gap-2 text-gray-600 hover:text-green-500 transition-all duration-200 transform ${
            isSharing ? 'scale-125' : ''
          }`}
          onClick={handleShare}
          disabled={isSharing}
        >
          <Share2 className={`h-5 w-5 ${isSharing ? 'animate-pulse' : ''}`} />
          <span>{shareCount}</span>
        </button>
      </div>

      {showSubPost && (
        <SubPost
          postId={postId}
          post={post}
          user={user}
          setShowSubPost={setShowSubPost}
          setCommentCount={setCommentCount}
        />
      )}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h3>
            
            <textarea
              className="w-full p-3 border rounded-lg mb-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bạn nghĩ gì về bài viết này?"
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setShareText("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmShare}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
              >
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default SocialPost;
