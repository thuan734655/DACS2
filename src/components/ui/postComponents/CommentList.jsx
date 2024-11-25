import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Flag } from "lucide-react";
import CommentInput from "./CommentInput";
import Replies from "./Replies";

function CommentList({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
}) {
  const [activeId, setActiveId] = useState(null); // ID của comment đang mở khung nhập

  const handleToggleCommentInput = (id) => {
    setActiveId((current) => (current === id ? null : id)); // Toggle active ID
  };

  return (
    <div className="space-y-4">
      {commentsList.map(
        ({ idUser,replyId, commentId, user, text, fileUrls, replies }) => (
          <div key={replyId || commentId} className="comment-thread">
            {/* Hiển thị comment chính */}
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={`${user[0].avatar}`}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-2">
                <p className="font-semibold text-sm">{user[0].fullName || "Anonymous"}</p>
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
            </div>

            {/* Hiển thị khung nhập nếu comment đang được active */}
            {activeId === commentId && (
              <div className="ml-10 mt-2">
                <CommentInput
                  postId={postId}
                  setCommentsList={setCommentsList}
                  setCommentCount={setCommentCount}
                  commentId={commentId}
                  isReply={true}
                  commentInputId={`comment-input-${commentId}`}
                />
              </div>
            )}

            {/* Hiển thị replies */}
            {replies?.length > 0 && (
              <Replies
                commentsList={replies}
                emojiChoose={emojiChoose}
                postId={postId}
                setCommentsList={setCommentsList}
                setCommentCount={setCommentCount}
                handleToggleCommentInput={handleToggleCommentInput}
                activeId={activeId}
                maxDepth={3} // Giới hạn cấp độ tối đa
              />
            )}
          </div>
        )
      )}
    </div>
  );
}

export default CommentList;
