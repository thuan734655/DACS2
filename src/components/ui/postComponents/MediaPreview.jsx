import React from "react";

function MediaPreview({ mediaUrls }) {
  return (
    <>
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 content-img">
          {mediaUrls.map((url, index) =>
            url.endsWith(".mp4") ? (
              <video
                key={index}
                src={"http://localhost:5000" + url}
                controls
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <img
                key={index}
                src={"http://localhost:5000" + url}
                alt={`Media ${index}`}
                className="w-full h-auto rounded-lg"
              />
            )
          )}
        </div>
      )}
    </>
  );
}

export default MediaPreview;
