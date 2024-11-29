// src/components/ui/NotificationItem.jsx
import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationItem = ({ notification, onClick }) => {
  const getNotificationContent = () => {
    const { type, data } = notification;

    switch (type) {
      case 'like':
        return {
          avatar: data.likedBy.avatar,
          primary: data.likedBy.fullName,
          secondary: 'đã thích bài viết của bạn',
        };
      case 'comment':
        return {
          avatar: data.comment.user.avatar,
          primary: data.comment.user.fullName,
          secondary: `đã bình luận: ${data.comment.text}`,
        };
      case 'reply':
        return {
          avatar: data.reply.user.avatar,
          primary: data.reply.user.fullName,
          secondary: `đã trả lời bình luận của bạn: ${data.reply.text}`,
        };
      case 'friend_request':
        return {
          avatar: data.requesterInfo.avatar,
          primary: data.requesterInfo.fullName,
          secondary: 'đã gửi lời mời kết bạn',
        };
      case 'friend_accept':
        return {
          avatar: data.accepterInfo.avatar,
          primary: data.accepterInfo.fullName,
          secondary: 'đã chấp nhận lời mời kết bạn của bạn',
        };
      default:
        return {
          avatar: '',
          primary: '',
          secondary: '',
        };
    }
  };

  const { avatar, primary, secondary } = getNotificationContent();
  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        backgroundColor: notification.read ? 'transparent' : '#f0f2f5',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <ListItemAvatar>
        <Avatar src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={primary}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
            >
              {secondary}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              {timeAgo}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default NotificationItem;