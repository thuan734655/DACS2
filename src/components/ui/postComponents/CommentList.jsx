import React, { useState } from "react";
import Avatar from "./Avatar";
import { ThumbsUp } from "lucide-react";
import CommentInput from "./CommentInput";
/**
 *
 * @param {Array} commentsList - [[0]: commentId , [1]: comment content ]
 * @returns
 */
function CommentList({
  commentsList,
  emojiChoose,
  handleReply,
  postId,
  setCommentsList,
  setCommentCount,
}) {
  const [visibleCommentInput, setVisibleCommentInput] = useState(null); // Track the visible comment input

  const handleToggleCommentInput = (commentId) => {
    setVisibleCommentInput((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <>
      {commentsList.map((data) => (
        <div className="flex flex-col" id={data[0]} key={data[0]}>
          <div className="flex items-start gap-2 mb-2">
            <Avatar src="/placeholder.svg" alt="Commenter" fallback="U" />
            <div className="flex-1 bg-gray-100 rounded-lg p-2">
              <p className="font-semibold text-sm">{data[1].user}</p>
              <p className="text-sm">{data[1].text}</p>
              {data[1].fileUrls &&
                data[1].fileUrls.map((fileUrl, fileIndex) =>
                  fileUrl.endsWith(".mp4") ? (
                    <video
                      key={fileIndex}
                      controls
                      className="w-full rounded-lg mt-2"
                      src={`http://localhost:5000${fileUrl}`}
                    />
                  ) : (
                    <img
                      key={fileIndex}
                      className="w-full rounded-lg mt-2"
                      src={`http://localhost:5000${fileUrl}`}
                      alt="Comment media"
                    />
                  )
                )}
            </div>
          </div>
          <div className="flex gap-8 ml-12 ">
            <span className="flex gap-2 ">
              {emojiChoose ? (
                emojiChoose
              ) : (
                <>
                  <ThumbsUp className="h-5 w-5" />
                  <span>Thích</span>
                </>
              )}
            </span>

            <span
              className="cursor-pointer"
              onClick={() => handleToggleCommentInput(data[0])}
            >
              Trả lời
            </span>
            <span>Báo cáo</span>
          </div>

          {/* Conditionally render the comment input based on the visible state */}
          {visibleCommentInput === data[0] && (
            <CommentInput
              postId={postId}
              setCommentsList={setCommentsList}
              setCommentCount={setCommentCount}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default CommentList;
