import axios from "axios";

const API_BASE_URL =
  "https://dacs-3847d-default-rtdb.asia-southeast1.firebasedatabase.app/";

// Hàm uploadMedia dùng để upload file ảnh hoặc video lên server
export const uploadMedia = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.mediaUrl; // Trả về URL của ảnh đã lưu trên server
  } catch (error) {
    console.error("Lỗi khi upload file:", error);
    throw error;
  }
};

// Hàm createPost để tạo một bài post mới với text và media URL
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts`, postData);
    return response.data; // Trả về thông tin post mới tạo
  } catch (error) {
    console.error("Lỗi khi tạo post:", error);
    throw error;
  }
};
