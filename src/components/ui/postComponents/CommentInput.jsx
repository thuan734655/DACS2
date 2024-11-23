import React from "react";
import { Send, ImageIcon, Smile, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function CommentInput({
  newComment,
  setNewComment,
  handleAddComment,
  handleFileChange,
  selectedFiles,
  handleRemoveFile,
  emojiPicker,
  handleEmojiClick,
  handleEmojiSelect
}) {
  return (
   <>
      <div className="flex items-start gap-2 mt-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết câu trả lời..."
                className="min-h-[40px] w-full rounded-lg bg-gray-100 px-4 py-2 text-sm resize-none focus:outline-none"
              />
              <div className="absolute right-2 top-2">
                <button
                  onClick={handleAddComment}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 px-2 relative">
              <button onClick={handleEmojiClick}>
                <Smile />
              </button>
              {emojiPicker && (
                <div className="absolute bottom-full left-0 mb-2">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}

              <label htmlFor="file-upload" className="cursor-pointer">
                <ImageIcon className="h-5 w-5" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {selectedFiles.map((fileData, index) => (
                  <div key={index} className="relative">
                    {fileData.file.type.startsWith("image/") ? (
                      <img
                        src={fileData.preview}
                        alt="Preview"
                        className="object-cover w-full h-20 rounded-md"
                      />
                    ) : (
                      <video
                        src={fileData.preview}
                        className="object-cover w-full h-20 rounded-md"
                        controls
                      />
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
   </>
  );
}

export default CommentInput;
