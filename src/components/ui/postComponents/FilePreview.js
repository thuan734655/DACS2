import React from "react";
import { X } from "lucide-react";

function FilePreview({ files, onRemove }) {
  if (files.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {files.map((fileData, index) => (
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
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default FilePreview;
