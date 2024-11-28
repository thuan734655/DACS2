import React from "react";
function EmojiPickerComponent({ setShowReactionPicker,handleLike }) {
  return (
    <div
    className="reaction-picker absolute top-full left-0 mt-2 flex gap-2 bg-white border p-2 rounded-lg shadow-lg"
    onMouseEnter={() => setShowReactionPicker(true)}
    onMouseLeave={() => setShowReactionPicker(false)}
  >
    {["👍", "❤️", "😂", "😢", "😡", "😲", "🥳"].map((emoji) => (
      <button key={emoji} onClick={() => handleLike(emoji)}>
        {emoji}
      </button>
    ))}
  </div>
  );
}

export default EmojiPickerComponent;
