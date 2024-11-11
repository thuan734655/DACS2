import axiosAPI from "./configAxios.js";

export const createPost = async (postData) => {
  try {
    const response = await axiosAPI.post("/posts", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response; 
  } catch (error) {
    console.error("Lỗi khi tạo post:", error);
    throw error;
  }
};
