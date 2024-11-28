import React, { useState, useEffect, useCallback } from "react";
import { Send, ImageIcon, Smile, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "video/mp4"]; // Allowed formats

function CommentInput({
  postId,
  setCommentsList,
  setCommentCount,
  isReply,
  replyName,
  replyId,
  commentId,
  commentInputId,
}) {
  const [newComment, setNewComment] = useState(
    isReply || replyId ? replyName + ": " : ""
  );
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const idUser = JSON.parse(localStorage.getItem("user")).idUser; // Lấy userId từ localStorage

  // Handle file change with validation
  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        alert("Chỉ cho phép ảnh (png, jpeg) và video (mp4): " + file.name);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("Dung lượng file quá lớn: " + file.name);
        return false;
      }
      return true;
    });

    const filesWithPreview = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  }, []);

  // Remove selected file from list
  const handleRemoveFile = useCallback((index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
    setEmojiPicker(false);
  }, []);

 
  // Handle comment submission
  const handleAddComment = useCallback(async () => {
    const userInfo = localStorage.getItem("user");
    if (newComment.trim()) {
      const comment = {
        postId,
        idUser: idUser,
        text: newComment,
        user: JSON.parse(userInfo),
      };
      // Convert files to Base64
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

      // Emit comment or reply to the server
      if (isReply) {
        console.log("new ");

        const replyContent = { replyData: comment, commentId };
        socket.emit("replyComment", replyContent);
      } else if (replyId) {
        console.log("new replies");

        const replyContent = { replyData: comment, replyId: replyId };
        socket.emit("replyToReply", replyContent);
      } else {
        console.log("new comment");
        console.log(postId)
        socket.emit("newComment", { comment });
      }

      // Reset state after adding the comment
      setNewComment("");
      setSelectedFiles([]);
    }
  }, [newComment, selectedFiles, postId, idUser, isReply, commentId]);
  return (
    <div
      className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-200"
      id={`comment-${commentInputId}`}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 hover:opacity-90 transition-all duration-200 shadow-sm">
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
            className="min-h-[45px] w-full rounded-lg bg-gray-50 px-4 py-3 text-[0.95rem] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200"
          />
          <div className="absolute right-3 top-2.5">
            <button
              onClick={handleAddComment}
              className="text-blue-500 hover:text-blue-600 transition-colors duration-200 p-1.5 rounded-full hover:bg-blue-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2 px-1 relative">
          <button
            onClick={() => setEmojiPicker(!emojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <Smile className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
          <label className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept={SUPPORTED_FORMATS.join(",")}
            />
            <ImageIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </label>
          {emojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 z-50 shadow-lg rounded-lg border border-gray-200 animate-fadeIn">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2.5 animate-fadeIn">
            {selectedFiles.map(({ preview, file }, index) => (
              <div key={index} className="relative group animate-slideIn">
                {file.type.startsWith("video/") ? (
                  <video
                    src={preview}
                    className="w-full h-28 object-cover rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
                    controls
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-28 object-cover rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
                  />
                )}
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentInput;
