import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Flag, ChevronDown, ChevronRight } from "lucide-react";
import CommentInput from "./CommentInput";
import Replies from "./Replies";
import socket from "../../../services/socket";

function CommentList({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
}) {
  const [activeId, setActiveId] = useState(null);
  const [openReplies, setOpenReplies] = useState({});

  const handleToggleCommentInput = (id) => {
    setActiveId((current) => (current === id ? null : id));
  };

  const toggleReplies = (replyId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  // Helper function to find and update nested replies
  const updateNestedReplies = (comments, commentId, newReply) => {
    return comments.map((comment) => {
      if (comment.commentId === commentId || comment.replyId === commentId) {
        // If this is the target comment, add the new reply
        return {
          ...comment,
          replies: [...(comment.replies || []), {
            ...newReply,
            replyId: newReply.id,
            user: Array.isArray(newReply.user) ? newReply.user : [newReply.user],
            replies: []
          }]
        };
      } else if (comment.replies && comment.replies.length > 0) {
        // If this comment has replies, recursively search them
        return {
          ...comment,
          replies: updateNestedReplies(comment.replies, commentId, newReply)
        };
      }
      return comment;
    });
  };

  useEffect(() => {
    // Listen for new comments
    socket.on("receiveComment", ({ newComment }) => {
      console.log("Received new comment:", newComment);
      if (newComment && newComment.postId === postId) {
        setCommentsList((prevComments) => [...prevComments, {
          ...newComment,
          replies: []
        }]);
        setCommentCount((prev) => prev + 1);
      }
    });

    // Listen for new replies
    socket.on("receiveReplyToComment", ({ commentId, newReply }) => {
      console.log("Received reply:", { commentId, newReply });
      if (newReply) {
        setCommentsList((prevComments) => updateNestedReplies(prevComments, commentId, newReply));
        // Automatically open the replies section when a new reply is added
        setOpenReplies((prev) => ({
          ...prev,
          [commentId]: true
        }));
      }
    });

    // Listen for reply-to-reply
    socket.on("receiveReplyToReply", ({ replyId, newReply }) => {
      console.log("Received reply to reply:", { replyId, newReply });
      if (newReply) {
        setCommentsList((prevComments) => {
          return prevComments.map((comment) => {
            // Check if this comment has the target reply
            if (comment.replies) {
              return {
                ...comment,
                replies: updateNestedReplies(comment.replies, replyId, newReply)
              };
            }
            return comment;
          });
        });
        // Automatically open the replies section
        setOpenReplies((prev) => ({
          ...prev,
          [replyId]: true
        }));
      }
    });

    return () => {
      socket.off("receiveComment");
      socket.off("receiveReplyToComment");
      socket.off("receiveReplyToReply");
    };
  }, [postId, setCommentsList, setCommentCount]);

  return (
    <div className="space-y-4">
      {commentsList.map(
        ({ idUser, replyId, commentId, user, text, fileUrls, replies }) => (
          <div key={replyId || commentId} className="comment-thread" id={commentId}>
            {/* Hiển thị comment chính */}
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={user[0].avatar || "anonymous"}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-2">
                <p className="font-semibold text-sm">
                  {user[0].fullName || "Anonymous"}
                </p>
                <p className="text-sm">{text || "No content available"}</p>
                {fileUrls?.map((fileUrl, index) =>
                  fileUrl.endsWith(".mp4") ? (
                    <video
                      key={index}
                      controls
                      className="w-full rounded-lg mt-2"
                      src={"http://localhost:5000" + fileUrl}
                    />
                  ) : (
                    <img
                      key={index}
                      className="w-full rounded-lg mt-2"
                      src={"http://localhost:5000" + fileUrl}
                      alt="Comment media"
                    />
                  )
                )}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4 ml-10">
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                {emojiChoose || (
                  <>
                    <ThumbsUp className="h-4 w-4" />
                    <span>Thích</span>
                  </>
                )}
              </button>
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={() => handleToggleCommentInput(commentId)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Trả lời</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <Flag className="h-4 w-4" />
                <span>Báo cáo</span>
              </button>
              {replies?.length > 0 && (
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  onClick={() => toggleReplies(commentId)}
                >
                  {openReplies[commentId] ? (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Ẩn {replies.length} phản hồi</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      <span>Xem thêm {replies.length} phản hồi</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Hiển thị khung nhập nếu comment đang được active */}
            {activeId === commentId && (
              <div className="ml-10 mt-2">
                <CommentInput
                  postId={postId}
                  replyTo={commentId}
                  setCommentsList={setCommentsList}
                  setCommentCount={setCommentCount}
                  commentId={commentId}
                  isReply={true}
                  replyName={user[0].fullName}
                  commentInputId={`comment-input-${commentId}`}
                />
              </div>
            )}

            {/* Hiển thị replies khi được mở */}
            {openReplies[commentId] && replies?.length > 0 && (
              <div className="ml-10">
                <Replies
                  commentsList={replies}
                  emojiChoose={emojiChoose}
                  postId={postId}
                  setCommentsList={setCommentsList}
                  setCommentCount={setCommentCount}
                  handleToggleCommentInput={handleToggleCommentInput}
                  activeId={activeId}
                  depth={0}
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default CommentList;