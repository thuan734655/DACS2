import axiosAPI from "./configAxios.js";

export const createPost = async (postData) => {
  try {
    const response = await axiosAPI.post("/api/posts", postData, {
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

export const getPosts = async () => {
  try {
    const response = await axiosAPI.get("/api/posts");
    return response;
  } catch (err) {
    console.error("get posts error");
  }
};
