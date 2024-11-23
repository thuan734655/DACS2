import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import io from "socket.io-client";
import PostContent from "./PostContent";

const socket = io("http://localhost:5000");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "video/mp4"]; // Allowed formats

const SubPost = ({
  postId,
  user,
  post,
  setShowSubPost,
  commentsList,
  setCommentsList,
  setCommentCount,
}) => {
  const [newComment, setNewComment] = useState("");
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user")).idUser
  );
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

  const handleReply = (reply) => {
    // Implement reply functionality if needed
  };

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
      socket.emit("newComment", { comment: comment });
      console.log(comment);

      // Reset state after adding the comment
      setNewComment("");
      setSelectedFiles([]);
    }
  };

  return (
    <div className="sub-post">
      <PostContent
        post={post}
        user={user}
        iconX={true}
        setShowSubPost={setShowSubPost}
      />
      <div className="mt-3 pt-3 border-t">
        <p className="pb-3 font-semibold">Bình luận: </p>
        <CommentList commentsList={commentsList} handleReply={handleReply} />
        <CommentInput
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          handleFileChange={handleFileChange}
          selectedFiles={selectedFiles}
          handleRemoveFile={handleRemoveFile}
        />
      </div>
    </div>
  );
};

export default SubPost;
