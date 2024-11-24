import React, { useState } from "react";
import Avatar from "./Avatar";
import { ThumbsUp } from "lucide-react";
import CommentInput from "./CommentInput";

function CommentList({
  commentsList,
  emojiChoose,
  postId,
  setCommentsList,
  setCommentCount,
  depth = 0,
}) {
  const [visibleCommentInput, setVisibleCommentInput] = useState(null);

  const handleToggleCommentInput = (commentId) => {
    setVisibleCommentInput((prev) => (prev === commentId ? null : commentId));
  };
  console.log(commentsList);

  return (
    <>
      {commentsList.map((data, index) => (
        <div
          className={`flex flex-col ${depth > 0 ? "ml-5" : ""}`}
          id={data.commentId}
          key={`${data.commentId}-${index}`} // Kết hợp commentId với index để đảm bảo key duy nhất
        >
          <div className="flex items-start gap-2 mb-2">
            <Avatar src="/placeholder.svg" alt="Commenter" fallback="U" />
            <div className="flex-1 bg-gray-100 rounded-lg p-2">
              <p className="font-semibold text-sm">{data.user}</p>
              <p className="text-sm">{data.text}</p>
              {data.fileUrls &&
                data.fileUrls.map((fileUrl, fileIndex) =>
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
          <div className="flex gap-8 ml-12">
            <span className="flex gap-2">
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
              onClick={() => handleToggleCommentInput(data.commentId)}
            >
              Trả lời
            </span>
            <span>Báo cáo</span>
          </div>

          {visibleCommentInput === data.commentId && (
            <CommentInput
              postId={postId}
              setCommentsList={setCommentsList}
              setCommentCount={setCommentCount}
              commentId={data.commentId}
              isReply={true}
              depth={depth + 1}
            />
          )}

          {/* Kiểm tra nếu có replies và chuyển đổi chúng thành mảng */}
          {data.replies &&
            Array.isArray(data.replies) &&
            data.replies.length > 0 && (
              <CommentList
                commentsList={data.replies} // Truyền trực tiếp mảng replies
                emojiChoose={emojiChoose}
                postId={postId}
                setCommentsList={setCommentsList}
                setCommentCount={setCommentCount}
                depth={depth + 1}
              />
            )}
        </div>
      ))}
    </>
  );
}

export default CommentList;
