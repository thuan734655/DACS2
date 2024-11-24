import React, { useEffect, useState } from "react";
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
}) {
  const [newComment, setNewComment] = useState(isReply ? replyName + ": " : "");
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user")).idUser
  );
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        alert("Chỉ cho phép ảnh (png, jpeg) và video: " + file.name);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("Dung lượng file quá lớn: " + file.name);
        return false;
      }
      return true; // Only return valid files
    });

    // Add valid files to the list with previews
    const filesWithPreview = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleEmojiSelect = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
    setEmojiPicker(false);
  };

  useEffect(() => {
    socket.on("receiveComment", (data) => {
      const commentId = Object.entries(data.newComment)[0][0]; // Get the commentId from newComment
      if (data.newComment[commentId].postId === postId) {
        setCommentsList((prevComments) => [
          ...prevComments,
          Object.entries(data.newComment)[0], // Append new comment
        ]);
        setCommentCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      socket.off("receiveComment");
    };
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const comment = {
        postId: postId,
        user: idUser,
        text: newComment,
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
      if (isReply) {
        const replyContent = {
          replyData: comment,
          commentId: commentId,
        };
        socket.emit("replyComment", replyContent);
      } else {
        socket.emit("newComment", { comment: comment });
      }
      console.log(comment);

      // Reset state after adding the comment
      setNewComment("");
      setSelectedFiles([]);
    }
  };
  return (
    <>
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
            <button onClick={() => setEmojiPicker(!emojiPicker)}>
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
    </>
  );
}

export default CommentInput;
