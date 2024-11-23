import React from "react";
import Avatar from "./Avatar";
import formatDate from "../../../utils/dateFormatter";
import { MoreHorizontal,X } from "lucide-react";
import MediaPreview from "./MediaPreview";

function PostContent({ user, post,iconX, setShowSubPost }) {
  const { createdAt, text, backgroundColor, textColor, mediaUrls } = post;
  const { fullName = "Unknown User", avatar = "/placeholder.svg" } = user[0] || {};
  return (
  <>
     <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={avatar} alt={fullName} fallback="IT" />
          <div>
            <h2 className="font-semibold text-sm">{fullName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{formatDate(createdAt)}</span>
              <span>•</span>
              <span>🌍</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
       { iconX ? <X onClick={() => setShowSubPost(false)}/> : <MoreHorizontal className="h-5 w-5" />}
        </button>
      </div>

      <div
        className="mt-3 rounded-lg p-4"
        style={{ backgroundColor, color: textColor }}
      >
        {text}
      </div>

      <div className="mt-3">
        <MediaPreview mediaUrls={mediaUrls} />
      </div>
  </>
  );
}

export default PostContent;
