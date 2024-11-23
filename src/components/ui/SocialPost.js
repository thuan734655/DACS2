import React, { useState, useEffect, useLayoutEffect } from "react";
import { ThumbsUp, MessageCircle, Send, Share2 } from "lucide-react";
import io from "socket.io-client";

import EmojiPickerComponent from "./postComponents/EmojiPickerComponent";
import PostContent from "./postComponents/PostContent";
import SubPost from "./postComponents/SubPost";

const socket = io("http://localhost:5000");

function SocialPost({ postId, post, user, groupedLikes }) {
  const { shares, comments } = post;

  const [likeCount, setlikedByCount] = useState(
    groupedLikes ? groupedLikes.length : 0
  );
  const [commentsList, setCommentsList] = useState(
    comments ? Object.entries(comments) : []
  );
  const [commentCount, setCommentCount] = useState(
    commentsList && commentsList !== 0 ? Object.entries(commentsList).length : 0
  );

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [emojiChoose, setEmojiChoose] = useState();
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user")).idUser
  );
  const [emojiCounts, setEmojiCounts] = useState(
    groupedLikes ? groupedLikes : {}
  );
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [subPost, setShowSubPost] = useState(false);
  useEffect(() => {
    const closeReactionPicker = (e) => {
      if (
        !e.target.closest(".reaction-picker") &&
        !e.target.closest("button")
      ) {
        setShowReactionPicker(false);
      }
    };
    document.addEventListener("click", closeReactionPicker);
    return () => document.removeEventListener("click", closeReactionPicker);
  }, []);
  console.log(commentsList);
  useEffect(() => {
    const closeEmojiPicker = (e) => {
      if (
        !e.target.closest(".emoji-picker-react") &&
        !e.target.closest("button")
      ) {
        setEmojiPicker(false);
      }
    };
    document.addEventListener("click", closeEmojiPicker);
    return () => document.removeEventListener("click", closeEmojiPicker);
  }, []);

  useLayoutEffect(() => {
    socket.on("receiveReaction", (data) => {
      if (data.postId === postId) {
        setEmojiCounts(data.grouped);
        setlikedByCount((prevCount) => prevCount + 1);
        setEmojiChoose(null);
      }
    });

    return () => {
      socket.off("receiveReaction");
    };
  }, [postId]);

  const handleLike = (emoji) => {
    const dataReq = { postId: postId, emoji: emoji, idUser: idUser };
    socket.emit("newReaction", dataReq);
    setShowReactionPicker(false);
  };

  const renderEmoji = () => {
    if (!emojiCounts) return null;

    let selectedEmoji = emojiChoose;

    const emojiElements = Object.entries(emojiCounts)
      .filter(([emoji, count]) => count.length > 0)
      .map(([emoji, count]) => {
        if (count.length === 0) return null;

        if (count.includes(idUser)) {
          selectedEmoji = emoji;
        }

        return (
          <div
            key={emoji}
            className="flex items-center gap-1 text-sm text-gray-500"
          >
            <span>{emoji}</span>
          </div>
        );
      });

    if (selectedEmoji !== emojiChoose) {
      setEmojiChoose(selectedEmoji);
      setShowReactionPicker(false);
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
          Chia sẻ
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Share2 className="h-5 w-5" />
          Chia sẻ
        </button>
      </div>
      {subPost && (
        <SubPost
          postId={postId}
          post={post}
          commentsList={commentsList}
          setCommentsList={setCommentsList}
          user={user}
          setShowSubPost={setShowSubPost}
          setCommentCount={setCommentCount}
        />
      )}
    </div>
  );
}

export default SocialPost;
