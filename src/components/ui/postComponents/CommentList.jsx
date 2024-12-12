import React, { useState, useEffect, useMemo } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Flag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import CommentInput from "./CommentInput";
import Replies from "./Replies";
import socket from "../../../services/socket";
import { formatTimestamp } from "../../../utils/timeFormat";
import { useToast } from "../../../context/ToastContext";

function CommentList({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
}) {
  const { showToast } = useToast();
  const [activeId, setActiveId] = useState(null);
  const [openReplies, setOpenReplies] = useState({});
  const [contentReport, setContentReport] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reportingCommentId, setReportingCommentId] = useState(null);

  const predefinedReasons = [
    "Nội dung không phù hợp",
    "Spam hoặc lừa đảo",
    "Bài viết chứa thông tin sai lệch",
    "Nội dung bạo lực hoặc xúc phạm",
  ];

  const handleReport = (commentId) => {
    const reason = contentReport || selectedReason;

    if (!reason) {
      showToast("Vui lòng chọn hoặc nhập lý do báo cáo!", "error");
      return;
    }

    const content = {
      reason: reason,
      type: "COMMENT",
      commentId: commentId,
    };

    socket.emit("report", content);
    showToast("Báo cáo bình luận thành công!", "success");
    setShowReportDialog(false);
    setContentReport("");
    setSelectedReason("");
    setReportingCommentId(null);
  };

  const openReportDialog = (commentId) => {
    setReportingCommentId(commentId);
    setShowReportDialog(true);
  };

  const handleToggleCommentInput = (id) => {
    setActiveId((current) => (current === id ? null : id));
  };

  const toggleReplies = (replyId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const updateNestedReplies = (comments, replyId, newReply) => {
    return comments.map((comment) => {
      if (comment.replyId === replyId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateNestedReplies(comment.replies, replyId, newReply),
        };
      }
      return comment;
    });
  };

  useEffect(() => {
    socket.on("receiveComment", ({ newComment }) => {
      if (newComment && newComment.postId === postId) {
        setCommentsList((prevComments) => [
          ...prevComments,
          { ...newComment, replies: [] },
        ]);
        setCommentCount((prev) => prev + 1);
      }
    });

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

    socket.on("receiveReplyToReply", ({ replyId, newReply }) => {
      if (newReply) {
        setCommentsList((prevComments) => {
          return prevComments.map((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateNestedReplies(
                  comment.replies,
                  replyId,
                  newReply
                ),
              };
            }
            return comment;
          });
        });
        setOpenReplies((prev) => ({ ...prev, [replyId]: true }));
      }
    });

    const handleResponse = (data) => {
      if (data.success) {
        showToast("Báo cáo bình luận thành công!", "success");
      } else {
        showToast("Lỗi khi báo cáo bình luận!", "error");
      }
    };

    socket.on("responseReportComment", handleResponse);

    return () => {
      socket.off("responseReportComment", handleResponse);
      socket.off("receiveComment");
      socket.off("receiveReplyToComment");
      socket.off("receiveReplyToReply");
    };
  }, [postId, setCommentsList, setCommentCount]);

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
        ({
          idUser,
          replyId,
          commentId,
          user = [],
          text,
          fileUrls,
          replies,
          timestamp,
        }) => (
          <div
            key={replyId || commentId}
            className="comment-thread"
            id={commentId}
          >
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
                        src={"https://dacs2-server-4.onrender.com" + fileUrl}
                      />
                    ) : (
                      <img
                        key={index}
                        className="w-full rounded-lg mt-2"
                        src={"https://dacs2-server-4.onrender.com" + fileUrl}
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

            <div className="flex gap-4 ml-10">
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={() => handleToggleCommentInput(commentId)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Trả lời</span>
              </button>
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={() => openReportDialog(commentId)}
              >
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
      {showReportDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-500">
          <div className="bg-zinc-700 p-4 rounded-lg w-96 max-w-full mx-4 z-10">
            <h2 className="text-lg font-bold mb-4">Báo cáo bình luận</h2>
            <select
              className="w-full p-2 mb-4 border rounded"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              <option value="">Chọn lý do</option>
              {predefinedReasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <textarea
              className="w-full p-2 mb-4 border rounded"
              placeholder="Hoặc nhập lý do khác..."
              value={contentReport}
              onChange={(e) => setContentReport(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowReportDialog(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => handleReport(reportingCommentId)}
              >
                Báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentList;
