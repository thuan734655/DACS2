import React, { useState, useEffect, useCallback } from "react";
import { ThumbsUp, MessageCircle, Send, Share2 } from "lucide-react";
import io from "socket.io-client";

import EmojiPickerComponent from "./postComponents/EmojiPickerComponent";
import PostContent from "./postComponents/PostContent";
import SubPost from "./postComponents/SubPost";

const socket = io("http://localhost:5000");

function SocialPost({ postId, post, user, groupedLikes, commentCountDefault }) {
  console.log(postId,"fasfas");
  const { shares } = post;
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
      console.log(data);
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
        if (users.includes(idUser)) {
          selectedEmoji = emoji;
        }

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
          <span>{shares} lượt chia sẻ</span>
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
                <>
                  <ThumbsUp className="h-5 w-5" />
                  <span>Thích</span>
                </>
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

        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Share2 className="h-5 w-5" />
          Chia sẻ
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
    </div>
  );
}

export default SocialPost;
