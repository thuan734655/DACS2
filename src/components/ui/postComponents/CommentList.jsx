import React from "react";
import Avatar from "./Avatar";
import { ThumbsUp } from "lucide-react";

function CommentList({ commentsList,emojiChoose,handleReply }) {
  
  return (
    <>
     {commentsList.map((comment, index) => (
          <div className="flex flex-col" id={comment.id} key={index}>
            <div className="flex items-start gap-2 mb-2">
              <Avatar src="/placeholder.svg" alt="Commenter" fallback="U" />
              <div className="flex-1 bg-gray-100 rounded-lg p-2">
                <p className="font-semibold text-sm">{comment.user}</p>
                <p className="text-sm">{comment.text}</p>
                {comment.fileUrls &&
                  comment.fileUrls.map((fileUrl, fileIndex) =>
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

              <span onClick={handleReply}>Trả lời</span>
              <span>Báo cáo</span>
            </div>
          </div>
        ))}
    </>
  );
}

export default CommentList;
