import React, { useState, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

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

function SocialPost({ postId, post, user }) {
  const {
    createdAt,
    shares,
    text,
    mediaUrls,
    backgroundColor,
    textColor,
    comments,
    likes,
  } = post;
  console.log(likes);

  const { fullName = "Unknown User", avatar = "/placeholder.svg" } =
    user[0] || {};
  const [likeCount, setLikesCount] = useState(likes ? likes.length : 0);
  const [commentCount, setCommentCount] = useState(
    comments && comments !== 0 ? comments.length : 0
  );
  const [newComment, setNewComment] = useState("");
  const [commentsList, setCommentsList] = useState(comments || []);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [emojiCounts, setEmojiCounts] = useState(likes || {});
  const [userSelection, setUserSelection] = useState(null);
  const [listEmojiHtml, setListEmojiHtml] = useState([]);
  console.log(emojiCounts);
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

  useEffect(() => {
    socket.on("receiveComment", (data) => {
      if (data.postId === postId) {
        setCommentsList((prevComments) => [...prevComments, data.comment]);
        setCommentCount((prevCount) => prevCount + 1);
      }
    });

    socket.on("receiveReaction", (data) => {
      console.log(data);
      if (data.postId === postId) {
        setEmojiCounts((prevCounts) => ({
          ...prevCounts,
          [data.emoji]: (prevCounts[data.emoji] || 0) + 1,
        }));
        setLikesCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      socket.off("receiveComment");
      socket.off("receiveReaction");
    };
  }, [postId]);

  useEffect(() => {
    const emojiArray = Object.entries(emojiCounts);
    const listEmoji = emojiArray
      .filter(([_, count]) => count >= 1)
      .sort((a, b) => b[1] - a[1])
      .map(([emoji, count]) => (
        <span key={emoji} className="text-lg mr-2">
          {emoji} {count}
        </span>
      ));
    setListEmojiHtml(listEmoji);
  }, [emojiCounts]);

  const handleLike = (emoji) => {
    const idUser = localStorage.getItem("idUser");

    console.log(userSelection, emoji);
    if (userSelection === emoji) {
      // Nếu người dùng chọn lại cùng emoji đã chọn, hủy cảm xúc
      setUserSelection(null); // Hủy cảm xúc đã chọn
      setLikesCount((prevCount) => prevCount - 1); // Giảm số lượng like
      socket.emit("removeReaction", { postId, emoji, idUser });
    } else {
      // Nếu người dùng chọn một emoji khác
      if (userSelection) {
        socket.emit("removeReaction", { postId, emoji: userSelection, idUser }); // Xóa cảm xúc cũ
      }

      // Thêm cảm xúc mới
      setUserSelection(emoji); // Lưu cảm xúc mới
      setLikesCount((prevCount) => prevCount + 1); // Tăng số lượng like cho cảm xúc mới
      socket.emit("newReaction", { postId, emoji, idUser }); // Gửi thông tin cảm xúc mới
    }

    setShowReactionPicker(false); // Đóng picker khi người dùng đã chọn
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = { user: "Current User", text: newComment };
      setCommentsList((prevComments) => [...prevComments, comment]);
      setNewComment("");
      setCommentCount((prevCount) => prevCount + 1);
      socket.emit("newComment", { postId, comment });
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()} - ${date.toLocaleDateString()}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4" id={postId}>
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

      <div
        className="mt-3 rounded-lg p-4"
        style={{ backgroundColor, color: textColor }}
      >
        {text}
      </div>

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

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <div className="mt-3">{listEmojiHtml}</div>
        </div>
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
            <ThumbsUp className="h-5 w-5" />
            <span>Thích</span>
          </button>

          {showReactionPicker && (
            <div
              className="reaction-picker absolute top-full left-0 mt-2 flex gap-2 bg-white border p-2 rounded-lg shadow-lg"
              onMouseEnter={() => setShowReactionPicker(true)}
              onMouseLeave={() => setShowReactionPicker(false)}
            >
              {["👍", "❤️", "😂", "😢", "😡", "😲", "🥳"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleLike(emoji)}
                  className={`text-2xl ${
                    userSelection === emoji ? "border-2 border-blue-500" : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

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

      <div className="mt-3 pt-3 border-t">
        {commentsList.map((comment, index) => (
          <div key={index} className="flex items-start gap-2">
            <Avatar src={comment.avatar} alt={comment.user} />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{comment.user}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          a
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
          className="w-full p-2 border rounded-lg"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default SocialPost;
