import React from "react";

function ReactionPicker({
  show,
  emojis,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) {
  if (!show) return null;

  return (
    <div
      className="reaction-picker absolute top-full left-0 mt-2 flex gap-2 bg-white border p-2 rounded-lg shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {emojis.map((emoji) => (
        <button key={emoji} onClick={() => onSelect(emoji)}>
          {emoji}
        </button>
      ))}
    </div>
  );
}

export default ReactionPicker;
