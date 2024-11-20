import React from "react";

function MediaDisplay({ mediaUrls }) {
  if (!mediaUrls || mediaUrls.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 content-img">
      {mediaUrls.map((url, index) =>
        url.endsWith(".mp4") ? (
          <video
            key={index}
            src={`http://localhost:5000${url}`}
            controls
            className="w-full h-auto rounded-lg"
          />
        ) : (
          <img
            key={index}
            src={`http://localhost:5000${url}`}
            alt={`Media ${index}`}
            className="w-full h-auto rounded-lg"
          />
        )
      )}
    </div>
  );
}

export default MediaDisplay;
