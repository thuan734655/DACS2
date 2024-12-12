import { toast } from 'react-toastify';

export const NotificationTypes = {
  LIKE: 'like',
  COMMENT: 'comment',
  FRIEND_REQUEST: 'friend_request',
  FRIEND_ACCEPT: 'friend_accept',
  SHARE: 'share',
  MENTION: 'mention',
  GROUP_INVITE: 'group_invite',
  GROUP_ACCEPT: 'group_accept',
  POST_TAG: 'post_tag',
};

const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getNotificationMessage = (notification) => {
  const { type, data, senderName } = notification;

  const getReactionText = (reactionType) => {
    const reactions = {
      like: 'thích',
      love: 'yêu thích',
      haha: 'thấy hài hước về',
      wow: 'ngạc nhiên về',
      sad: 'buồn về',
      angry: 'giận dữ về',
      care: 'quan tâm đến'
    };
    return reactions[reactionType] || 'thích';
  };

  const messages = {
    [NotificationTypes.LIKE]: {
      title: () => {
        const reaction = getReactionText(data.emoji);
        return getRandomMessage([
          `${senderName} đã bày tỏ cảm xúc ${reaction} bài viết của bạn`,
          `${senderName} vừa ${reaction} bài viết của bạn`,
          `${senderName} đã ${reaction} nội dung bạn đăng`,
        ]);
      },
      description: () => data.postTitle ? `"${data.postTitle}"` : 'Bài viết của bạn',
    },
    [NotificationTypes.COMMENT]: {
      title: () => getRandomMessage([
        `${senderName} đã bình luận về bài viết của bạn`,
        `${senderName} vừa để lại bình luận`,
        `Có bình luận mới từ ${senderName}`,
      ]),
      description: () => data.preview ? `"${data.preview}"` : 'Xem bình luận',
    },
    [NotificationTypes.SHARE]: {
      title: () => getRandomMessage([
        `${senderName} đã chia sẻ bài viết của bạn`,
        `${senderName} vừa chia sẻ nội dung của bạn`,
        `Bài viết của bạn đã được ${senderName} chia sẻ`,
        `${senderName} thấy bài viết của bạn hay và đã chia sẻ`,
        `${senderName} muốn lan tỏa bài viết của bạn`
      ]),
      description: () => {
        if (data.shareText) {
          return `"${data.shareText}"`;
        }
        return data.postTitle ? `"${data.postTitle}"` : 'Xem bài viết được chia sẻ';
      }
    },
    [NotificationTypes.FRIEND_REQUEST]: {
      title: () => getRandomMessage([
        `${senderName} đã gửi lời mời kết bạn`,
        `Bạn có lời mời kết bạn mới từ ${senderName}`,
        `${senderName} muốn kết nối với bạn`,
      ]),
      description: () => 'Xem và phản hồi lời mời kết bạn',
    },
    [NotificationTypes.FRIEND_ACCEPT]: {
      title: () => getRandomMessage([
        `${senderName} đã chấp nhận lời mời kết bạn`,
        `Bạn và ${senderName} đã trở thành bạn bè`,
        `${senderName} đã đồng ý kết bạn với bạn`,
      ]),
      description: () => 'Giờ đây các bạn đã là bạn bè',
    },
    [NotificationTypes.MENTION]: {
      title: () => getRandomMessage([
        `${senderName} đã nhắc đến bạn trong một bài viết`,
        `${senderName} vừa gắn thẻ bạn`,
        `Bạn được nhắc đến bởi ${senderName}`,
      ]),
      description: () => data.preview ? `"${data.preview}"` : 'Xem bài viết',
    },
    [NotificationTypes.GROUP_INVITE]: {
      title: () => getRandomMessage([
        `${senderName} đã mời bạn tham gia nhóm`,
        `Lời mời tham gia nhóm mới từ ${senderName}`,
        `${senderName} muốn bạn tham gia nhóm`,
      ]),
      description: () => data.groupName ? `Nhóm: ${data.groupName}` : 'Xem lời mời nhóm',
    },
    [NotificationTypes.GROUP_ACCEPT]: {
      title: () => getRandomMessage([
        `${senderName} đã chấp nhận lời mời tham gia nhóm`,
        `${senderName} đã tham gia nhóm của bạn`,
        `Thành viên mới: ${senderName} đã tham gia nhóm`,
      ]),
      description: () => data.groupName ? `Nhóm: ${data.groupName}` : 'Xem thông tin nhóm',
    },
    [NotificationTypes.POST_TAG]: {
      title: () => getRandomMessage([
        `${senderName} đã gắn thẻ bạn trong một bài viết`,
        `${senderName} vừa nhắc đến bạn`,
        `Bạn được gắn thẻ bởi ${senderName}`,
      ]),
      description: () => data.postTitle ? `"${data.postTitle}"` : 'Xem bài viết',
    },
  };

  const messageConfig = messages[type];
  if (!messageConfig) {
    return {
      title: 'Thông báo mới',
      description: '',
      action: 'xem'
    };
  }

  return {
    title: messageConfig.title(),
    description: messageConfig.description(),
    action: type
  };
};

export const showNotificationToast = (notification) => {
  const message = getNotificationMessage(notification);
  toast.info(message.title, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const getNotificationIcon = (type) => {
  const icons = {
    [NotificationTypes.LIKE]: {
      icon: '❤️',
      color: 'text-red-500'
    },
    [NotificationTypes.COMMENT]: {
      icon: '💬',
      color: 'text-blue-500'
    },
    [NotificationTypes.SHARE]: {
      icon: '↗️',
      color: 'text-green-500'
    },
    [NotificationTypes.FRIEND_REQUEST]: {
      icon: '👋',
      color: 'text-purple-500'
    },
    [NotificationTypes.FRIEND_ACCEPT]: {
      icon: '🤝',
      color: 'text-indigo-500'
    },
    [NotificationTypes.MENTION]: {
      icon: '@',
      color: 'text-yellow-500'
    },
    [NotificationTypes.GROUP_INVITE]: {
      icon: '👥',
      color: 'text-teal-500'
    },
    [NotificationTypes.GROUP_ACCEPT]: {
      icon: '✨',
      color: 'text-cyan-500'
    },
    [NotificationTypes.POST_TAG]: {
      icon: '🏷️',
      color: 'text-orange-500'
    },
  };

  return icons[type] || { icon: '📢', color: 'text-gray-500' };
};

export const getReactionEmoji = (reactionType) => {
  const reactions = {
    like: '👍',
    love: '❤️',
    haha: '😆',
    wow: '😮',
    sad: '😢',
    angry: '😠',
    care: '🤗'
  };
  return reactions[reactionType] || reactionType;
};
