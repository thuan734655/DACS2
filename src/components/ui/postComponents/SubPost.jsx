import React, { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import PostContent from "./PostContent";
import socket from "../../../services/socket";

const SubPost = ({
  postId,
  post,
  postUser,
  setShowSubPost,
  setCommentCount,
}) => {
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to track comments fetching
  console.log(postId, "posf");
  useEffect(() => {
    // Emit event to fetch all comments for the post
    socket.emit("getCommentsAll", { postId });

    // Listen for the comments list from the server
    socket.on("receiveCommentsList", (data) => {
      console.log(data);
      if (data) {
        setCommentsList(data);
        setLoading(false); // Set loading to false once data is received
      }
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("receiveCommentsList");
    };
  }, []);

  return (
    <div className="sub-post">
      {/* Displaying PostContent */}
      <PostContent
        post={post}
        postUser={postUser}
        isComment={true}
        onClose={() => setShowSubPost(false)}
        iconX={true}
        setShowSubPost={setShowSubPost}
      />

      <div className="mt-3 pt-3 border-t">
        <p className="pb-3 font-semibold">Bình luận: </p>

        {/* Render only if comments are loaded */}
        {!loading ? (
          <>
            <CommentList
              commentsList={commentsList}
              postId={postId}
              setCommentsList={setCommentsList}
              setCommentCount={setCommentCount}
            />
            <CommentInput
              postId={postId}
              setCommentsList={setCommentsList}
              setCommentCount={setCommentCount}
            />
          </>
        ) : (
          <p>Đang tải bình luận...</p> // Show loading message while comments are being fetched
        )}
      </div>
    </div>
  );
};

export default SubPost;
