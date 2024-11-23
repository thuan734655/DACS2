import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import Avatar from "./postComponents/Avatar";

import io from "socket.io-client";

import formatDate from "../../utils/dateFormatter";

import CommentList from "./postComponents/CommentList";
import EmojiPickerComponent from "./postComponents/EmojiPickerComponent";
import MediaPreview from "./postComponents/MediaPreview";
import CommentInput from "./postComponents/CommentInput";

const socket = io("http://localhost:5000");

function SocialPost({ postId, post, user, groupedLikes }) {
  const {
    createdAt,
    shares,
    text,
    mediaUrls,
    backgroundColor,
    textColor,
    comments,
  } = post;

  const { fullName = "Unknown User", avatar = "/placeholder.svg" } =
    user[0] || {};
  const [likeCount, setlikedByCount] = useState(
    groupedLikes ? groupedLikes.length : 0
  );
  const [commentCount, setCommentCount] = useState(
    comments && comments !== 0 ? comments.length : 0
  );
  const [newComment, setNewComment] = useState("");
  const [commentsList, setCommentsList] = useState(
    comments
      ? Object.entries(comments).map(([id, comment]) => ({ id, ...comment }))
      : []
  );
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [emojiChoose, setEmojiChoose] = useState();
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user")).idUser
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [emojiCounts, setEmojiCounts] = useState(
    groupedLikes ? groupedLikes : {}
  );
  const [emojiPicker, setEmojiPicker] = useState(false);
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
    socket.on("receiveComment", (data) => {
      if (data.comment.postId === postId) {
        setCommentsList((prevComments) => [...prevComments, data.comment]);
        setCommentCount((prevCount) => prevCount + 1);
      }
    });

    socket.on("receiveReaction", (data) => {
      if (data.postId === postId) {
        setEmojiCounts(data.grouped);
        setlikedByCount((prevCount) => prevCount + 1);
        setEmojiChoose(null);
      }
    });

    return () => {
      socket.off("receiveComment");
      socket.off("receiveReaction");
    };
  }, [postId]);

  const handleLike = (emoji) => {
    const dataReq = { postId: postId, emoji: emoji, idUser: idUser };
    socket.emit("newReaction", dataReq);
    setShowReactionPicker(false);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const comment = {
        postId: postId,
        user: idUser,
        text: newComment,
      };

      // Chuyển file sang Base64
      const base64Files = await Promise.all(
        selectedFiles.map(({ file }) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                name: file.name,
                type: file.type,
                data: reader.result,
              });
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          });
        })
      );

      comment.listFileUrl = base64Files;
      socket.emit("newComment", { comment: comment });
      setNewComment("");
      setSelectedFiles([]);
    }
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

  const handleEmojiClick = () => {
    console.log("handleEmojiClick");
  };

  const handleEmojiSelect = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
    setEmojiPicker(false);
  };

  const handleReply = (reply) => {};

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
        <MediaPreview mediaUrls={mediaUrls} />
      </div>

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

        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
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

      <div className="mt-3 pt-3 border-t">
        <CommentList
          commentsList={commentsList}
          emojiChoose={emojiChoose}
          handleReply={handleReply}
        />
        <CommentInput
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          handleFileChange={handleFileChange}
          selectedFiles={selectedFiles}
          handleRemoveFile={handleRemoveFile}
          emojiPicker={emojiPicker}
          handleEmojiClick={() => setEmojiPicker(!emojiPicker)}
          handleEmojiSelect={handleEmojiSelect}
        />
      </div>
    </div>
  );
}

export default SocialPost;
