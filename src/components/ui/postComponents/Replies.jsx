import React, { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Flag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import CommentInput from "./CommentInput";

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
  const [openReplies, setOpenReplies] = useState({}); // Trạng thái để lưu các reply nào đang được mở

  // Hàm toggle trạng thái mở/đóng các replies
  const toggleReplies = (replyId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId], // Đảo trạng thái hiện tại của replyId
    }));
  };
  return (
    <div className={`${depth < 5 ? "ml-4" : "reset-ml"} mt-2`}>
      {/* Duyệt qua từng reply trong commentsList */}
      {commentsList.map((reply) => (
        <div
          key={reply.replyId}
          className="reply-thread border-l border-gray-200 pl-3 "
        >
          {/* Hiển thị thông tin người dùng và nội dung reply */}
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
          {/* Các nút chức năng như Like, Reply, Report */}
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
              onClick={() => handleToggleCommentInput(reply.replyId)} // Mở/đóng khung nhập comment
            >
              <MessageCircle className="h-4 w-4" />
              <span>Trả lời</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Flag className="h-4 w-4" />
              <span>Báo cáo</span>
            </button>

            {/* Hiển thị nút để mở/thu gọn các replies con */}
            {reply.replies?.length > 0 && (
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={() => toggleReplies(reply.replyId)} // Toggle mở/đóng replies con
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

          {/* Hiển thị khung nhập comment nếu đang được active */}
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

          {/* Nếu reply có replies con và đang mở, hiển thị tiếp */}
          {openReplies[reply.replyId] && reply.replies?.length > 0 && (
            <Replies
              commentsList={reply.replies} // Truyền các replies con vào component Replies
              emojiChoose={emojiChoose}
              postId={postId}
              setCommentsList={setCommentsList}
              setCommentCount={setCommentCount}
              handleToggleCommentInput={handleToggleCommentInput}
              activeId={activeId}
              depth={depth + 1} // Tăng depth để hiển thị thụt lề cho các replies con
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Replies;
