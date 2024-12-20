import React, { useState, useEffect, useCallback } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import socket from "../../services/socket";
import { useToast } from "../../context/ToastContext";
import EmojiPickerComponent from "./postComponents/EmojiPickerComponent";
import PostContent from "./postComponents/PostContent";
import SubPost from "./postComponents/SubPost";

function SocialPost({ postId, post, user, groupedLikes, commentCountDefault }) {
  const { showToast } = useToast();
  const [shareCount, setShareCount] = useState(post.shares || 0);
  const [previousShareCount, setPreviousShareCount] = useState(
    post.shares || 0
  );
  const [shareUpdateAnimation, setShareUpdateAnimation] = useState("");
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
    const handlePostShared = ({
      postId: sharedPostId,
      shareCount,
      success,
      error,
      senderId,
    }) => {
      if (senderId === idUser) {
        if (sharedPostId === postId) {
          console.log("[DEBUG] Received postShared event:", {
            sharedPostId,
            shareCount,
            success,
          });
          setShareCount(shareCount);

          if (success) {
            showToast("Đã chia sẻ bài viết thành công!", "success");
            setShowConfirmDialog(false);
            setIsSharing(false);
          } else if (error) {
            showToast(`Lỗi khi chia sẻ bài viết: ${error}`, "error");
            setIsSharing(false);
          }
        }
      }
    };

    socket.off("postShared", handlePostShared);
    socket.on("postShared", handlePostShared);

    return () => {
      socket.off("postShared", handlePostShared);
    };
  }, [postId, previousShareCount, showToast, idUser]);

  const handleShare = () => {
    if (isSharing) return; // Prevent double submission

    if (!idUser) {
      showToast("Vui lòng đăng nhập để chia sẻ bài viết!", "error");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmShare = () => {
    if (isSharing) return; // Prevent double submission

    setIsSharing(true);
    console.log("[DEBUG] Emitting sharePost event:", {
      postId,
      idUser,
      shareText,
    });

    socket.emit("sharePost", {
      postId,
      idUser,
      shareText,
    });

    setShareText("");
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

    socket.off("receiveReaction", handleReceiveReaction);
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
    const counts = emojiCounts || {};
    let selectedEmoji = emojiChoose;

    const emojiElements = Object.entries(counts)
      .filter(([emoji, users]) => users && users.length > 0)
      .map(([emoji, users]) => {
        if (users) {
          users.forEach((user) => {
            if (user - "0" === parseInt(idUser)) {
              selectedEmoji = emoji;
            }
          });
        }

        return (
          <div
            key={emoji}
            className="flex items-center gap-1 text-sm text-gray-500"
          >
            <span>{emoji}</span>
            <span>{users ? users.length : 0}</span>
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
      <PostContent post={post} />
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">{renderEmoji()}</div>
        <div className="flex items-center gap-3">
          <span>{commentCount} bình luận</span>
          <span>{shareCount} lượt chia sẻ</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t flex justify-between items-center px-4">
        <div className="relative flex-1 flex justify-center">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 w-full justify-center"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
          >
            <span className="flex gap-2 items-center">
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

        <div className="flex-1 flex justify-center">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 w-full justify-center"
            onClick={() => setShowSubPost((prev) => !prev)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>Bình luận</span>
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <button
            className={`flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all duration-200 transform w-full justify-center ${
              isSharing ? "scale-125" : ""
            }`}
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 className={`h-5 w-5 ${isSharing ? "animate-pulse" : ""}`} />
            <span className={shareUpdateAnimation}>{shareCount}</span>
          </button>
        </div>
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
    </div>
  );
}

export default SocialPost;
