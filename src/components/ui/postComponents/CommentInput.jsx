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

  // Listen for new comments from the server
  useEffect(() => {
    socket.on("receiveComment", ({ newComment }) => {
      console.log(newComment);
      newComment.user = [newComment.user];
      if (newComment.postId === postId) {
        setCommentsList((prevComments) => [...prevComments, newComment]);
        setCommentCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      socket.off("receiveComment");
    };
  }, [postId, setCommentsList, setCommentCount]);

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
        const replyContent = { replyData: comment, commentId };
        console.log(commentId);
        socket.emit("replyComment", replyContent);
      } else if (replyId) {
        console.log(replyId, 123);
        const replyContent = { replyData: comment, replyId: replyId };
        socket.emit("replyToReply", replyContent);
      } else {
        socket.emit("newComment", { comment });
      }

      // Reset state after adding the comment
      setNewComment("");
      setSelectedFiles([]);
    }
  }, [newComment, selectedFiles, postId, idUser, isReply, commentId]);

  return (
    <div
      className="flex items-start gap-2 mt-4"
      id={`comment-${commentInputId}`}
    >
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
          <button onClick={() => setEmojiPicker(!emojiPicker)}>
            <Smile />
          </button>
          {emojiPicker && (
            <div className="absolute bottom-full left-0 mb-2">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}

          <label
            htmlFor={`file-upload-${commentInputId}`}
            className="cursor-pointer"
          >
            <ImageIcon className="h-5 w-5" />
            <input
              id={`file-upload-${commentInputId}`}
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
  );
}

export default CommentInput;
