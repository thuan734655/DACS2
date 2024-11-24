import React from "react";
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
          postId={postId}
          setCommentsList={setCommentsList}
          setCommentCount={setCommentCount}
        />
        <CommentInput
          postId={postId}
          setCommentsList={setCommentsList}
          setCommentCount={setCommentCount}
        />
      </div>
    </div>
  );
};

export default SubPost;
