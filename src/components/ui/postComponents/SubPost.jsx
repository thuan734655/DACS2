import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import PostContent from "./PostContent";

const SubPost = ({
  postId,
  user,
  post,
  setShowSubPost,
  commentsList,
  setCommentsList,
  setCommentCount,
}) => {
  const handleReply = (reply) => {};

  return (
    <div className="sub-post">
      <PostContent
        post={post}
        user={user}
        iconX={true}
        setShowSubPost={setShowSubPost}
      />
      <div className="mt-3 pt-3 border-t">
        <p className="pb-3 font-semibold">Bình luận: </p>
        <CommentList
          commentsList={commentsList}
          handleReply={handleReply}
          postId={postId}
          setCommentsList={setCommentsList}
          setCommentCount={setCommentCount}
        />
        <CommentInput
          postId={postId}
          post={post}
          commentsList={commentsList}
          setCommentsList={setCommentsList}
          user={user}
          setShowSubPost={setShowSubPost}
          setCommentCount={setCommentCount}
        />
      </div>
    </div>
  );
};

export default SubPost;
