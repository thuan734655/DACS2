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
  const [openReplies, setOpenReplies] = useState({});

  const toggleReplies = (replyId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  return (
    <div className={`${depth < 5 ? "ml-4" : "reset-ml"} mt-2`}>
      {commentsList.map((reply) => (
        <div
          key={reply.replyId}
          className="reply-thread border-l border-gray-200 pl-3"
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
            </div>
          </div>

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
              onClick={() => handleToggleCommentInput(reply.replyId)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Trả lời</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Flag className="h-4 w-4" />
              <span>Báo cáo</span>
            </button>

            {/* Hiển thị nút để mở/thu gọn các replies con nếu có */}
            {reply.replies?.length > 0 && (
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={() => toggleReplies(reply.replyId)}
              >
                {openReplies[reply.replyId] ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Ẩn {reply.replies.length} phản hồi</span>
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

          {/* Hiển thị khung nhập reply khi được active */}
          {activeId === reply.replyId && (
            <div className="ml-10 mt-2">
              <CommentInput
                postId={postId}
                replyTo={reply.replyId}
                setCommentsList={setCommentsList}
                setCommentCount={setCommentCount}
                commentId={reply.replyId}
                isReply={true}
                replyName={reply.user[0].fullName}
                commentInputId={`comment-input-${reply.replyId}`}
              />
            </div>
          )}

          {/* Hiển thị các replies con khi được mở */}
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
    </div>
  );
};

export default Replies;
