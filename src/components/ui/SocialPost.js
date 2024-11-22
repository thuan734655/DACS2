import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Send,
  Share2,
  ImageIcon,
  Smile,
  X,
} from "lucide-react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

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
  const { groupedLikes } = post;
  const {
    createdAt,
    shares,
    text,
    mediaUrls,
    backgroundColor,
    textColor,
    comments,
  } = post.post;

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
  const [emojiChosse, setEmojiChosse] = useState();
  const [idUser, setIdUser] = useState(localStorage.getItem("idUser"));
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
        console.log("fasfs");
      }
    });

    socket.on("receiveReaction", (data) => {
      if (data.postId === postId) {
        setEmojiCounts(data.grouped);
        setlikedByCount((prevCount) => prevCount + 1);
        setEmojiChosse(null);
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()} - ${date.toLocaleDateString()}`;
  };

  const renderEmoji = () => {
    if (!emojiCounts) return null;

    let selectedEmoji = emojiChosse;

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
            <span>{count.length}</span>
          </div>
        );
      });

    if (selectedEmoji !== emojiChosse) {
      setEmojiChosse(selectedEmoji);
      setShowReactionPicker(false);
    }
 
    return emojiElements;
  };

  const handleEmojiClick = () => {
    setEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
    setEmojiPicker(false);
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
          {renderEmoji()}
          {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
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
            <span className="flex gap-2 ">
              {emojiChosse ? (
                emojiChosse
              ) : (
                <>
                  <ThumbsUp className="h-5 w-5" />
                  <span>Thích</span>
                </>
              )}
            </span>
          </button>

          {showReactionPicker && (
            <div
              className="reaction-picker absolute top-full left-0 mt-2 flex gap-2 bg-white border p-2 rounded-lg shadow-lg"
              onMouseEnter={() => setShowReactionPicker(true)}
              onMouseLeave={() => setShowReactionPicker(false)}
            >
              {["👍", "❤️", "😂", "😢", "😡", "😲", "🥳"].map((emoji) => (
                <button key={emoji} onClick={() => handleLike(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
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
        {commentsList.map((comment, index) => (
          <div className="flex flex-col" key={comment.id || index}>
            <div className="flex items-start gap-2 mb-2">
              <Avatar src="/placeholder.svg" alt="Commenter" fallback="U" />
              <div className="flex-1 bg-gray-100 rounded-lg p-2">
                <p className="font-semibold text-sm">{comment.user}</p>
                <p className="text-sm">{comment.text}</p>
                {comment.fileUrls &&
                  comment.fileUrls.map((fileUrl, fileIndex) =>
                    fileUrl.endsWith(".mp4") ? (
                      <video
                        key={fileIndex}
                        controls
                        className="w-full rounded-lg mt-2"
                        src={`http://localhost:5000${fileUrl}`}
                      />
                    ) : (
                      <img
                        key={fileIndex}
                        className="w-full rounded-lg mt-2"
                        src={`http://localhost:5000${fileUrl}`}
                        alt="Comment media"
                      />
                    )
                  )}
              </div>
            </div>
            <div className="flex gap-8 ml-12 ">
              <span className="flex gap-2 ">
                {emojiChosse ? (
                  emojiChosse
                ) : (
                  <>
                    <ThumbsUp className="h-5 w-5" />
                    <span>Thích</span>
                  </>
                )}
              </span>

              <span>Trả lời</span>
              <span>Báo cáo</span>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-2 mt-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết câu trả lời..."
                className="min-h-[40px] w-full rounded-lg bg-gray-100 px-4 py-2 text-sm resize-none focus:outline-none"
              />
              <div className="absolute right-2 top-2">
                <button
                  onClick={handleAddComment}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 px-2 relative">
              <button onClick={handleEmojiClick}>
                <Smile />
              </button>
              {emojiPicker && (
                <div className="absolute bottom-full left-0 mb-2">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}

              <label htmlFor="file-upload" className="cursor-pointer">
                <ImageIcon className="h-5 w-5" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {selectedFiles.map((fileData, index) => (
                  <div key={index} className="relative">
                    {fileData.file.type.startsWith("image/") ? (
                      <img
                        src={fileData.preview}
                        alt="Preview"
                        className="object-cover w-full h-20 rounded-md"
                      />
                    ) : (
                      <video
                        src={fileData.preview}
                        className="object-cover w-full h-20 rounded-md"
                        controls
                      />
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialPost;
