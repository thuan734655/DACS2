import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Flag, ChevronDown, ChevronRight } from "lucide-react";
import CommentInput from "./CommentInput";

const Replies = ({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
  handleToggleCommentInput,
  activeId,
}) => {
  const [openReplies, setOpenReplies] = useState({}); // Trạng thái mở/đóng replies

  const toggleReplies = (replyId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId], // Đổi trạng thái mở/đóng
    }));
  };

  return (
    <div className="ml-8 mt-2 border-l-2 border-gray-200 pl-4">
      {commentsList.map((reply) => (
        <div key={reply.replyId} className="reply-thread">
          {/* Hiển thị thông tin reply */}
          <div className="flex items-start gap-2 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img
                src="/placeholder.svg"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-2">
              <p className="font-semibold text-sm">{reply.user}</p>
              <p className="text-sm">{reply.text}</p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4 ml-10">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              {emojiChoose || (
                <>
                  <ThumbsUp className="h-4 w-4" />
                  <span>Like</span>
                </>
              )}
            </button>
            <button
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              onClick={() => handleToggleCommentInput(reply.replyId)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Reply</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Flag className="h-4 w-4" />
              <span>Report</span>
            </button>

            {/* Nút Show/Hide replies */}
            {reply.replies?.length > 0 && (
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                onClick={() => toggleReplies(reply.replyId)}
              >
                {openReplies[reply.replyId] ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Hide Replies</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span>Show Replies</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Hiển thị khung nhập nếu active */}
          {activeId === reply.replyId && (
            <div className="ml-10 mt-2">
              <CommentInput
                postId={postId}
                setCommentsList={setCommentsList}
                setCommentCount={setCommentCount}
                commentId={reply.replyId}
                replyId={reply.replyId}
                commentInputId={`comment-input-reply-${reply.replyId}`} // Tạo ID duy nhất
              />
            </div>
          )}

          {/* Hiển thị replies con nếu đang mở */}
          {openReplies[reply.replyId] &&
            reply.replies?.map((nestedReply) => (
              <div key={nestedReply.replyId} className="ml-8 mt-2">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="/placeholder.svg"
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg p-2">
                    <p className="font-semibold text-sm">{nestedReply.user}</p>
                    <p className="text-sm">{nestedReply.text}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Replies;
