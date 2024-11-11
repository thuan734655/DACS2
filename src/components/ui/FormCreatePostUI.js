import { useState } from "react";
import { X, Image, Users, ChevronDown } from "lucide-react";
import axios from "axios";

const FromCreatePost = ({ setFormCreatePostVisible }) => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setFormCreatePostVisible(false);
    setPostText("");
    setSelectedFiles([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    const idUser = localStorage.getItem("idUser");
    setIsLoading(true);
    let formData = new FormData();
    formData.append("text", postText);
    formData.append("idUser", idUser);

    selectedFiles.forEach((fileData, index) => {
      formData.append("media", fileData.file);
    });

    formData.forEach((data, key) => console.log(data, key));

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleClose();
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[500px] shadow-xl">
        {/* Header */}
        <div className="relative border-b p-4">
          <h1 className="text-xl font-semibold text-center">Create Post</h1>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 flex items-center gap-2">
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold">Your Name</div>
            <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm">
              <Users className="h-3 w-3" />
              Friends
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Post Input */}
        <div className="p-4">
          <textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full min-h-[150px] text-lg resize-none outline-none border rounded-md p-2"
          />
        </div>

        {/* Media Upload Area */}
        <div className="mx-4 border rounded-lg p-4">
          <div className="text-center">
            <div className="font-semibold">Add Photo/Video</div>
            <div className="text-sm text-gray-500">or drag and drop</div>

            {/* Icon image upload */}
            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2 cursor-pointer"
            >
              <Image className="h-6 w-6" />
            </label>

            {/* Hidden file input */}
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
          </div>

          {/* Preview selected files */}
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
                  {/* Remove file button */}
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

        {/* Action Buttons
        <div className="m-4 p-3 border rounded-lg flex items-center">
          <div className="flex-1 font-medium text-sm">Add to your post</div>
          <div className="flex gap-2">
            {[Image, Users, Smile, MapPin, MoreHorizontal].map((Icon, index) => (
              <button
                key={index}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Action"
              >
                <Icon className="h-6 w-6" />
              </button>
            ))}
          </div>
        </div> */}

        {/* Post Button */}
        <div className="p-4">
          <button
            onClick={handlePost}
            disabled={!postText.trim() || isLoading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8H4z"
                  />
                </svg>
                Posting...
              </span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FromCreatePost;
