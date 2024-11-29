import React, { useState, useEffect, useMemo } from "react";
import { ThumbsUp, MessageCircle, Flag, ChevronDown, ChevronRight } from "lucide-react";
import CommentInput from "./CommentInput";
import Replies from "./Replies";
import socket from "../../../services/socket";
import { formatTimestamp } from "../../../utils/timeFormat";

function CommentList({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
}) {
  const [activeId, setActiveId] = useState(null); // ID của comment đang mở khung nhập
  const [openReplies, setOpenReplies] = useState({}); // Trạng thái của replies con

  // Toggle input field for comment reply
  const handleToggleCommentInput = (id) => {
    setActiveId((current) => (current === id ? null : id)); // Toggle active ID
  };

  // Toggle replies visibility
  const toggleReplies = (replyId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId], // Đảo trạng thái hiện tại của replyId
    }));
  };

  // Helper function to find and update nested replies
  const updateNestedReplies = (comments, replyId, newReply) => {
    return comments.map((comment) => {
      if (comment.replyId === replyId) {
        // If this is the target reply, add the new reply to its replies array
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        // If this comment has replies, recursively search them
        return {
          ...comment,
          replies: updateNestedReplies(comment.replies, replyId, newReply),
        };
      }
      return comment;
    });
  };

  // Update the comment list when new comment or reply is received
  useEffect(() => {
    // Listen for new comments
    socket.on("receiveComment", ({ newComment }) => {
      if (newComment && newComment.postId === postId) {
        setCommentsList((prevComments) => [
          ...prevComments,
          { ...newComment, replies: [] },
        ]);
        setCommentCount((prev) => prev + 1);
      }
    });

    // Listen for new replies to comments
    socket.on("receiveReplyToComment", ({ commentId, newReply }) => {
      if (newReply) {
        setCommentsList((prevComments) => {
          return prevComments.map((comment) => {
            if (comment.commentId === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              };
            }
            return comment;
          });
        });
        setOpenReplies((prev) => ({ ...prev, [commentId]: true }));
      }
    });

    // Listen for replies to replies
    socket.on("receiveReplyToReply", ({ replyId, newReply }) => {
      if (newReply) {
        setCommentsList((prevComments) => {
          return prevComments.map((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateNestedReplies(comment.replies, replyId, newReply),
              };
            }
            return comment;
          });
        });
        setOpenReplies((prev) => ({ ...prev, [replyId]: true }));
      }
    });

    return () => {
      socket.off("receiveComment");
      socket.off("receiveReplyToComment");
      socket.off("receiveReplyToReply");
    };
  }, [postId, setCommentsList, setCommentCount]);

  // Sort comments by timestamp in descending order (newest first)
  const sortedComments = useMemo(() => {
    return [...commentsList].sort((a, b) => {
      const timestampA = new Date(a.timestamp || 0).getTime();
      const timestampB = new Date(b.timestamp || 0).getTime();
      return timestampB - timestampA;
    });
  }, [commentsList]);

  return (
    <div className="space-y-4">
      {sortedComments.map(
        ({ idUser, replyId, commentId, user = [], text, fileUrls, replies, timestamp }) => (
          <div key={replyId || commentId} className="comment-thread" id={commentId}>
            {/* Hiển thị comment chính */}
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={user[0]?.avatar || "anonymous"}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-2">
                  <p className="font-semibold text-sm">
                    {user[0]?.fullName || "Anonymous"}
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
                <div className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(timestamp)}
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4 ml-10">
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                {emojiChoose || (
                  <React.Fragment>
                    <ThumbsUp className="h-4 w-4" />
                    <span>Thích</span>
                  </React.Fragment>
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
                    <React.Fragment>
                      <ChevronDown className="h-4 w-4" />
                      <span>Ẩn {replies.length} phản hồi</span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <ChevronRight className="h-4 w-4" />
                      <span>Xem thêm {replies.length} phản hồi</span>
                    </React.Fragment>
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
                  replyName={user[0]?.fullName}
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
