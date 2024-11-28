import React, { useState, useEffect, useMemo } from "react";
import { MessageCircle, Flag, ChevronDown, ChevronRight } from "lucide-react";
import CommentInput from "./CommentInput";
import Replies from "./Replies";
import { formatTimestamp } from "../../../utils/timeFormat";
import EmojiReactions from "./EmojiReactions";
import socket from "../../../services/socket";
import { getDatabase, ref, onValue, off } from "firebase/database";
import firebaseApp from "../../../config/firebaseConfig";
import { addOrUpdateReaction, removeReaction, getReactionsForComments } from "../../../services/reactionService";

function CommentList({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
}) {
  const [openReplies, setOpenReplies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const db = getDatabase(firebaseApp);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);

    // Lấy reactions cho tất cả comments
    const loadReactions = async () => {
      try {
        const commentIds = commentsList.map(comment => comment.commentId);
        const reactions = await getReactionsForComments(commentIds);
        
        setCommentsList(prevComments => 
          prevComments.map(comment => ({
            ...comment,
            reactions: reactions[comment.commentId] || []
          }))
        );
      } catch (error) {
        console.error("Error loading reactions:", error);
      }
    };

    if (commentsList.length > 0) {
      loadReactions();
    }
  }, [commentsList.length]);

  useEffect(() => {
    // Lắng nghe thay đổi reactions từ Firebase
    const reactionsRef = ref(db, 'reactions/comments');
    
    onValue(reactionsRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const reactionsData = snapshot.val();
      setCommentsList(prevComments => 
        prevComments.map(comment => ({
          ...comment,
          reactions: Object.entries(reactionsData[comment.commentId] || {}).map(([userId, reaction]) => ({
            ...reaction,
            userId
          }))
        }))
      );
    });

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

    return () => {
      // Cleanup listeners
      off(reactionsRef);
      socket.off("receiveComment");
      socket.off("receiveReplyToComment");
    };
  }, [db, postId]);

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

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleToggleCommentInput = (commentId) => {
    setActiveCommentId(activeCommentId === commentId ? null : commentId);
  };

  // Helper function to find and update nested replies
  const updateNestedReplies = (comments, commentId, newReply) => {
    return comments.map((comment) => {
      if (comment.commentId === commentId || comment.replyId === commentId) {
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
        return {
          ...comment,
          replies: updateNestedReplies(comment.replies, commentId, newReply)
        };
      }
      return comment;
    });
  };

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
        ({ idUser, replyId, commentId, user = [], text, fileUrls, replies, timestamp, reactions = [] }) => (
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
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-semibold hover:underline"
                  onClick={() => handleToggleCommentInput(commentId)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Trả lời</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-semibold hover:underline">
                  <Flag className="h-4 w-4" />
                  <span>Báo cáo</span>
                </button>
                {replies?.length > 0 && (
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
            {activeCommentId === commentId && (
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
                  activeId={activeCommentId}
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