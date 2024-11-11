import React from 'react';
import { MoreHorizontal, ThumbsUp, MessageCircle, Send, Share2 } from 'lucide-react';

// Avatar Component
function Avatar({ src, fallback, alt }) {
  return (
    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
      {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : fallback}
    </div>
  );
}

// SocialPost Component
function SocialPost({
  authorName = "Thực tập sinh IT Việt Nam",
  authorImage = "/placeholder.svg?height=40&width=40",
  timestamp = "28 phút",
  content = "Fake CV từ intern lên junior và đã pass :)) HR chỉ có nhìn bằng + ielts + gpa :)) hết !",
  reactionCount = 179,
  commentCount = 36,
  shareCount = 2,
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={authorImage} alt={authorName} fallback="IT" />
          <div>
            <h2 className="font-semibold text-sm">{authorName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{timestamp}</span>
              <span>•</span>
              <span>🌍</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mt-3 rounded-lg overflow-hidden bg-gradient-to-b from-orange-400 via-pink-500 to-purple-600 p-8 text-white text-center text-lg font-medium">
        {content}
      </div>

      {/* Engagement Stats */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <span className="flex items-center">
            👍 😆
            <span className="ml-1">{reactionCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>{commentCount} bình luận</span>
          <span>{shareCount} lượt chia sẻ</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-3 border-t grid grid-cols-4 gap-1">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ThumbsUp className="h-5 w-5" />
          <span>Thích</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <MessageCircle className="h-5 w-5" />
          <span>Bình luận</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Send className="h-5 w-5" />
          <span>Gửi</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <Share2 className="h-5 w-5" />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-start gap-2">
          <Avatar src="/placeholder.svg?height=32&width=32" alt="Commenter" fallback="U" />
          <div className="flex-1 bg-gray-100 rounded-lg p-2">
            <p className="font-semibold text-sm">Tran Anh Tien</p>
            <p className="text-sm">R lúc pv technical thì sao bạn?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialPost;
