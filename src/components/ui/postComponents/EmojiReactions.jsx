import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';

const EmojiReactions = ({ 
  postId, 
  commentId, 
  reactions = [], 
  currentUserId,
  handleReaction,
  handleRemoveReaction
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const emojis = ['👍', '❤️', '😆', '😮', '😢', '😡'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userReaction = reactions.find(r => r.userId === currentUserId);

  const onEmojiClick = async (emoji) => {
    if (userReaction?.type === emoji) {
      await handleRemoveReaction(commentId);
    } else {
      await handleReaction(commentId, emoji);
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative">
      <button
        className={`flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-semibold hover:underline ${
          userReaction ? 'text-blue-600' : ''
        }`}
        onClick={() => {
          if (userReaction) {
            handleRemoveReaction(commentId);
          } else {
            onEmojiClick('👍');
          }
        }}
        onMouseEnter={() => setShowEmojiPicker(true)}
      >
        {userReaction ? (
          <span className="text-base">{userReaction.type}</span>
        ) : (
          <ThumbsUp className="h-4 w-4" />
        )}
        <span>{userReaction ? '' : 'Thích'}</span>
      </button>

      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg px-2 py-1 flex items-center gap-1 z-50"
          onMouseLeave={() => setShowEmojiPicker(false)}
        >
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className={`text-xl hover:scale-125 transition-transform p-1 rounded-full ${
                userReaction?.type === emoji ? 'bg-gray-100' : ''
              }`}
              onClick={() => onEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiReactions;
