import React, { useState, useEffect, useCallback } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { MoreVert, ThumbUp, Comment, Share } from "@mui/icons-material";
import socket from "../../../services/socket";
import { useToast } from "../../../context/ToastContext";
import EmojiPickerComponent from "./EmojiPickerComponent";
import PostContent from "./PostContent";
import SubPost from "./SubPost";

const SharedPosts = ({
  postId,
  post,
  postUser,
  groupedLikes,
  commentCountDefault,
}) => {
  const { showToast } = useToast();
  const [shareCount, setShareCount] = useState(post?.shares || 0);
  const [likeCount, setLikeCount] = useState(
    groupedLikes ? Object.values(groupedLikes).flat().length : 0
  );
  const [commentCount, setCommentCount] = useState(commentCountDefault || 0);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [emojiChoose, setEmojiChoose] = useState(null);
  const [idUser, setIdUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.idUser || ""
  );
  const [emojiCounts, setEmojiCounts] = useState(groupedLikes || {});
  const [showSubPost, setShowSubPost] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    const handlePostShared = ({
      postId: sharedPostId,
      shareCount,
      success,
      error,
      senderId,
    }) => {
      if (senderId === idUser) {
        if (sharedPostId === postId) {
          setShareCount(shareCount);
          if (success) {
            showToast("Đã chia sẻ bài viết thành công!", "success");
            setShowConfirmDialog(false);
            setIsSharing(false);
          } else if (error) {
            showToast(`Lỗi khi chia sẻ bài viết: ${error}`, "error");
            setIsSharing(false);
          }
        }
      }
    };

    socket.off("postShared", handlePostShared);
    socket.on("postShared", handlePostShared);

    return () => {
      socket.off("postShared", handlePostShared);
    };
  }, [postId, showToast, idUser]);

  const handleShare = () => {
    if (isSharing) return;
    if (!idUser) {
      showToast("Vui lòng đăng nhập để chia sẻ bài viết!", "error");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmShare = () => {
    if (isSharing) return;
    setIsSharing(true);
    socket.emit("sharePost", {
      postId,
      idUser,
      shareText,
    });
    setShareText("");
  };

  const handleOutsideClick = useCallback((e) => {
    if (!e.target.closest(".reaction-picker") && !e.target.closest("button")) {
      setShowReactionPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    const handleReceiveReaction = (data) => {
      if (data.postId === postId) {
        setEmojiCounts(data.groupedLikes);
        setLikeCount(Object.values(data.groupedLikes).flat().length);
        setEmojiChoose(null);
      }
    };

    socket.off("receiveReaction", handleReceiveReaction);
    socket.on("receiveReaction", handleReceiveReaction);

    return () => {
      socket.off("receiveReaction", handleReceiveReaction);
    };
  }, [postId]);

  const handleLike = (emoji) => {
    if (!idUser) {
      console.error("User ID not found");
      return;
    }

    const dataReq = { postId, emoji, idUser };
    socket.emit("newReaction", dataReq);

    setShowReactionPicker(false);
  };

  const renderEmoji = () => {
    const counts = emojiCounts || {};
    let selectedEmoji = emojiChoose;

    const emojiElements = Object.entries(counts)
      .filter(([emoji, users]) => users && users.length > 0)
      .map(([emoji, users]) => {
        if (users) {
          users.forEach((user) => {
            if (user - "0" === parseInt(idUser)) {
              selectedEmoji = emoji;
            }
          });
        }

        return (
          <Typography
            key={emoji}
            variant="body2"
            component="span"
            sx={{ display: "flex", alignItems: "center", mr: 1 }}
          >
            {emoji} {users ? users.length : 0}
          </Typography>
        );
      });

    if (selectedEmoji !== emojiChoose) {
      setEmojiChoose(selectedEmoji);
    }

    return emojiElements;
  };

  const formattedDate = post ? new Date(post.createdAt).toLocaleString() : "";

  return (
    <Card sx={{ mb: 2, borderRadius: "12px" }}>
      <CardHeader
        avatar={
          <Avatar
            src={postUser?.avatar || "/default-avatar.png"}
            alt={postUser?.fullName || "User Avatar"}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={
          <Typography variant="h6">
            {postUser?.fullName || "Unknown User"}
          </Typography>
        }
        subheader={formattedDate}
      />
      <CardContent>
        {post && (
          <>
            <PostContent post={post} postUser={postUser} />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {renderEmoji()}
              </Box>
              <Typography variant="body2">
                {commentCount} bình luận • {shareCount} lượt chia sẻ
              </Typography>
            </Box>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                startIcon={emojiChoose ? emojiChoose : <ThumbUp />}
                onClick={() => setShowReactionPicker(!showReactionPicker)}
              >
                {emojiChoose ? "Đã thích" : "Thích"}
              </Button>
              <Button
                startIcon={<Comment />}
                onClick={() => setShowSubPost((prev) => !prev)}
              >
                Bình luận
              </Button>
              <Button
                startIcon={<Share />}
                onClick={handleShare}
                disabled={isSharing}
              >
                Chia sẻ
              </Button>
            </Box>
            {showReactionPicker && (
              <Box sx={{ position: "relative" }}>
                <EmojiPickerComponent
                  setShowReactionPicker={setShowReactionPicker}
                  handleLike={handleLike}
                />
              </Box>
            )}
          </>
        )}
      </CardContent>
      {showSubPost && (
        <SubPost
          postId={postId}
          post={post}
          postUser={postUser}
          setShowSubPost={setShowSubPost}
          setCommentCount={setCommentCount}
        />
      )}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Chia sẻ bài viết</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="share-text"
            label="Bạn nghĩ gì về bài viết này?"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Hủy</Button>
          <Button onClick={confirmShare} color="primary">
            Chia sẻ
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SharedPosts;
