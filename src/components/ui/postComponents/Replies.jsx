import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Flag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import CommentInput from "./CommentInput";
import { useToast } from "../../../context/ToastContext";
import socket from "../../../services/socket";

const Replies = ({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
  handleToggleCommentInput,
  activeId,
  depth = 0,
}) => {
  const { showToast } = useToast();
  const [openReplies, setOpenReplies] = useState({});
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [contentReport, setContentReport] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [reportingReplyId, setReportingReplyId] = useState(null);

  const predefinedReasons = [
    "Nội dung không phù hợp",
    "Spam hoặc lừa đảo",
    "Bài viết chứa thông tin sai lệch",
    "Nội dung bạo lực hoặc xúc phạm",
  ];

  const toggleReplies = (replyId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const handleReport = (replyId) => {
    const reason = contentReport || selectedReason;

    if (!reason) {
      showToast("Vui lòng chọn hoặc nhập lý do báo cáo!", "error");
      return;
    }

    const content = {
      reason: reason,
      type: "REPLY",
      replyId: replyId,
    };

    socket.emit("report", content);

    setShowReportDialog(false);
    setContentReport("");
    setSelectedReason("");
    setReportingReplyId(null);
  };

  const openReportDialog = (replyId) => {
    setReportingReplyId(replyId);
    setShowReportDialog(true);
  };

  useEffect(() => {
    const handleResponse = (data) => {
      if (data.success) {
        showToast("Báo cáo phản hồi thành công!", "success");
      } else {
        showToast("Lỗi khi báo cáo phản hồi!", "error");
      }
    };

    socket.on("responseReportReply", handleResponse);

    return () => {
      socket.off("responseReportReply", handleResponse);
    };
  }, [showToast]);

  return (
    <div className={`${depth < 5 ? "ml-4" : "reset-ml"} mt-2`}>
      {commentsList.map((reply) => (
        <div
          key={reply.replyId}
          className="reply-thread border-l border-gray-200 pl-3"
        >
          <div className="flex items-start gap-2 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img
                src={`${reply.user[0].avatar || "anonymous"}`}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-2">
              <p className="font-semibold text-sm">
                {reply.user[0].fullName || "anonymous"}
              </p>
              <p className="text-sm">{reply.text}</p>
            </div>
          </div>
          {reply.fileUrls?.map((fileUrl, index) =>
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
              onClick={() => handleToggleCommentInput(reply.replyId)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Trả lời</span>
            </button>
            <button
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              onClick={() => openReportDialog(reply.replyId)}
            >
              <Flag className="h-4 w-4" />
              <span>Báo cáo</span>
            </button>

            {reply.replies?.length > 0 && (
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={() => toggleReplies(reply.replyId)}
              >
                {openReplies[reply.replyId] ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Ẩn bớt</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span>Xem thêm {reply.replies.length} phản hồi</span>
                  </>
                )}
              </button>
            )}
          </div>

          {activeId === reply.replyId && (
            <div className="ml-10 mt-2">
              <CommentInput
                postId={postId}
                setCommentsList={setCommentsList}
                setCommentCount={setCommentCount}
                commentId={reply.replyId}
                replyId={reply.replyId}
                replyName={reply.user[0].fullName}
                commentInputId={`comment-input-reply-${reply.replyId}`}
              />
            </div>
          )}

          {openReplies[reply.replyId] && reply.replies?.length > 0 && (
            <Replies
              commentsList={reply.replies}
              emojiChoose={emojiChoose}
              postId={postId}
              setCommentsList={setCommentsList}
              setCommentCount={setCommentCount}
              handleToggleCommentInput={handleToggleCommentInput}
              activeId={activeId}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
      {showReportDialog && (
        <div className=" absolute  fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-zinc-700 p-4 rounded-lg w-96 max-w-full mx-4 z-10">
            <h2 className="text-lg font-bold mb-4">Báo cáo phản hồi</h2>
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
                onClick={() => handleReport(reportingReplyId)}
              >
                Báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Replies;
