import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

function EmojiPickerWrapper({ onEmojiSelect }) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  useEffect(() => {
    const closeEmojiPicker = (e) => {
      if (!e.target.closest(".emoji-picker")) {
        setEmojiPickerVisible(false);
      }
    };
    document.addEventListener("click", closeEmojiPicker);
    return () => document.removeEventListener("click", closeEmojiPicker);
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setEmojiPickerVisible((prev) => !prev)}>😊</button>
      {emojiPickerVisible && (
        <div className="absolute top-full left-0 mt-2 emoji-picker">
          <EmojiPicker onEmojiClick={(e) => onEmojiSelect(e.emoji)} />
        </div>
      )}
    </div>
  );
}

export default EmojiPickerWrapper;
