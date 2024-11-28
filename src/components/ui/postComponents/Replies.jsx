import React, { useState, useEffect } from "react";
import { MessageCircle, Flag, ChevronDown, ChevronRight } from "lucide-react";
import CommentInput from "./CommentInput";
import { formatTimestamp } from "../../../utils/timeFormat";
import EmojiReactions from "./EmojiReactions";
import { addOrUpdateReaction, removeReaction } from "../../../services/reactionService";

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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReaction = async (commentId, type) => {
    if (!currentUser?.idUser) return;

    try {
      await addOrUpdateReaction(currentUser.idUser, commentId, type);
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const handleRemoveReaction = async (commentId) => {
    if (!currentUser?.idUser) return;

    try {
      await removeReaction(currentUser.idUser, commentId);
    } catch (error) {
      console.error("Error removing reaction:", error);
    }
  };

  return (
    <div className="space-y-4">
      {commentsList.map(
        ({ idUser, replyId, commentId, user = [], text, fileUrls, replies, timestamp, reactions = [] }) => (
          <div key={replyId || commentId} className="comment-thread">
            {/* Hiển thị reply */}
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

            {/* Nút hành động và số lượt thích */}
            <div className="flex items-center justify-between ml-10">
              <div className="flex items-center gap-4">
                <EmojiReactions
                  postId={postId}
                  commentId={commentId}
                  reactions={reactions}
                  currentUserId={currentUser?.idUser}
                  handleReaction={handleReaction}
                  handleRemoveReaction={handleRemoveReaction}
                />
                {depth < 2 && (
                  <button
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-semibold hover:underline"
                    onClick={() => handleToggleCommentInput(commentId)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Trả lời</span>
                  </button>
                )}
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-semibold hover:underline">
                  <Flag className="h-4 w-4" />
                  <span>Báo cáo</span>
                </button>
                {replies?.length > 0 && depth < 2 && (
                  <button
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-semibold hover:underline"
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

              {/* Hiển thị reactions bên phải */}
              {reactions.length > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {Array.from(new Set(reactions.map(r => r.type))).slice(0, 2).map((type, index) => (
                      <span 
                        key={index} 
                        className="text-base"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">{reactions.length}</span>
                </div>
              )}
            </div>

            {/* Hiển thị khung nhập nếu comment đang được active */}
            {activeId === commentId && depth < 2 && (
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
            {openReplies[commentId] && replies?.length > 0 && depth < 2 && (
              <div className="ml-10">
                <Replies
                  commentsList={replies}
                  emojiChoose={emojiChoose}
                  postId={postId}
                  setCommentsList={setCommentsList}
                  setCommentCount={setCommentCount}
                  handleToggleCommentInput={handleToggleCommentInput}
                  activeId={activeId}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Replies;