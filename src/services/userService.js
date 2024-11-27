import axiosAPI from "./configAxios.js";

export const getUserProfile = async () => {
  try {
    const response = await axiosAPI.get("/api/users/profile");
    return response.data || null;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
};

export const getOnlineFriends = async () => {
  try {
    const response = await axiosAPI.get("/api/users/online-friends");
    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè online:", error);
    return [];
  }
};

export const getFriendRequests = async () => {
  try {
    const response = await axiosAPI.get("/api/users/friend-requests");
    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy lời mời kết bạn:", error);
    return [];
  }
};

export const respondToFriendRequest = async (requestId, accept) => {
  try {
    const response = await axiosAPI.post(`/api/users/friend-requests/${requestId}`, {
      accept,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi phản hồi lời mời kết bạn:", error);
    throw error;
  }
};
