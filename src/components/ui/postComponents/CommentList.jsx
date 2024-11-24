import React, { useState, useMemo } from "react";
import { ThumbsUp, MessageCircle, Flag } from "lucide-react";
import CommentInput from "./CommentInput";

function CommentList({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
  depth = 0,
}) {
  const [activeId, setActiveId] = useState(null); // Dùng một state duy nhất để quản lý ID đang mở

  const handleToggleCommentInput = (id) => {
    setActiveId((current) => (current === id ? null : id)); // Nếu ID đang mở, ẩn đi, nếu không thì mở
  };

  // Memoize rendered comments to avoid unnecessary re-renders
  const renderComments = useMemo(() => {
    const render = (comments) => {
      return comments.map(
        ({ replyId, commentId, user, text, fileUrls, replies }) => (
          <div key={replyId || commentId} className="comment-thread">
            {/* Main comment */}
            <div className="flex flex-col">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src="/placeholder.svg"
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-2">
                  <p className="font-semibold text-sm">{user}</p>
                  <p className="text-sm">{text}</p>
                  {fileUrls?.map((fileUrl, index) =>
                    fileUrl.endsWith(".mp4") ? (
                      <video
                        key={index}
                        controls
                        className="w-full rounded-lg mt-2"
                        src={`http://localhost:5000${fileUrl}`}
                      />
                    ) : (
                      <img
                        key={index}
                        className="w-full rounded-lg mt-2"
                        src={`http://localhost:5000${fileUrl}`}
                        alt="Comment media"
                      />
                    )
                  )}
                </div>
              </div>

              {/* Action buttons */}
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
                  onClick={() => handleToggleCommentInput(commentId)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Reply</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>

              {/* Comment input - only show if this comment is active */}
              {activeId === commentId && (
                <div className="ml-10 mt-2">
                  <CommentInput
                    postId={postId}
                    setCommentsList={setCommentsList}
                    setCommentCount={setCommentCount}
                    commentId={commentId}
                    isReply={false}
                    depth={depth + 1}
                  />
                </div>
              )}
            </div>

            {/* Render replies with indentation */}
            {replies?.length > 0 && (
              <div className="ml-8 mt-2 border-l-2 border-gray-200 pl-4">
                {replies.map((reply) => (
                  <div key={reply.replyId} className="reply-thread">
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

                    {/* Action buttons for reply */}
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
                    </div>

                    {/* Comment input for reply - only show if this reply is active */}
                    {activeId === reply.replyId && (
                      <div className="ml-10 mt-2">
                        <CommentInput
                          postId={postId}
                          setCommentsList={setCommentsList}
                          setCommentCount={setCommentCount}
                          commentId={reply.replyId}
                          isReply={true}
                          depth={depth + 1}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      );
    };
    return render(commentsList);
  }, [
    commentsList,
    activeId,
    emojiChoose,
    postId,
    setCommentsList,
    setCommentCount,
    depth,
  ]);

  return <div className="space-y-4">{renderComments}</div>;
}

export default CommentList;
