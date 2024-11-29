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
    const userData = localStorage.getItem("user");
    const currentUser = JSON.parse(userData);
    const response = await axiosAPI.get(`/api/users/${currentUser.idUser}/friend-requests`);
    
    // Log chi tiết danh sách người gửi lời mời
    console.log('=== Danh sách lời mời kết bạn ===');
    response.data.forEach((request, index) => {
      console.log(`${index + 1}. Người gửi:`, {
        ID: request.requester_id,
        'Họ tên': request.fullName,
        'Ngày sinh': request.dateOfBirth,
        'Bạn chung': request.mutualFriends || 0,
        'Avatar': request.avatar
      });
    });
    console.log('Tổng số lời mời:', response.data.length);
    console.log('================================');
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lời mời kết bạn:", error);
    return [];
  }
};

export const respondToFriendRequest = async (requester_id, accept) => {
  try {
    const userData = localStorage.getItem("user");
    const currentUser = JSON.parse(userData);
    
    // Log để debug
    console.log('Sending response with data:', {
      requester_id,
      accept
    });

    const response = await axiosAPI.post(
      `/api/users/${currentUser.idUser}/respond-friend-request`,
      {
        requester_id: requester_id,  // Đổi tên key thành requester_id
        accept
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi phản hồi lời mời kết bạn:", error);
    throw error;
  }
};
export const getSuggestedFriends = async (limit = 10) => {
  try {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error("Người dùng chưa đăng nhập");
    }

    const { idUser } = JSON.parse(userData);
    
    // Gọi API với userId trong path thay vì params
    const response = await axiosAPI.get(`/api/users/${idUser}/suggested-friends?limit=${limit}`);
   
    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý kết bạn:", error);
    return [];
  }
};
export const sendFriendRequest = async (userId, requesterId) => {
  try {
    const response = await axiosAPI.post(`/api/users/${userId}/send-friend-request`, {
      requesterId: requesterId  // Thêm requesterId vào body
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi lời mời kết bạn:", error);
    throw error;
  }
};

