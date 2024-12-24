import { reload } from "firebase/auth";
import axiosAPI from "./configAxios.js";

export const getUserProfile = async () => {
  try {
    const response = await axiosAPI.get("/api/users/profile");
    console.log("Phản hồi lấy thông tin người dùng:", response.data); // Log để debug
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
    const response = await axiosAPI.get(
      `/api/users/${currentUser.idUser}/friend-requests`
    );

    // Log chi tiết danh sách người gửi lời mời
    console.log("=== Danh sách lời mời kết bạn ===");
    response.data.forEach((request, index) => {
      console.log(`${index + 1}. Người gửi:`, {
        ID: request.requester_id,
        "Họ tên": request.fullName,
        "Ngày sinh": request.dateOfBirth,
        "Bạn chung": request.mutualFriends || 0,
        Avatar: request.avatar,
      });
    });
    console.log("Tổng số lời mời:", response.data.length);
    console.log("================================");

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
    console.log("Gửi phản hồi với dữ liệu:", {
      requester_id,
      accept,
    });

    const response = await axiosAPI.post(
      `/api/users/${currentUser.idUser}/respond-friend-request`,
      {
        requester_id: requester_id, // Đổi tên key thành requester_id
        accept,
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
    const response = await axiosAPI.get(
      `/api/users/${idUser}/suggested-friends?limit=${limit}`
    );

    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý kết bạn:", error);
    return [];
  }
};
export const sendFriendRequest = async (userId, requesterId) => {
  try {
    const response = await axiosAPI.post(
      `/api/users/${userId}/send-friend-request`,
      {
        requesterId: requesterId, // Thêm requesterId vào body
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi lời mời kết bạn:", error);
    throw error;
  }
};
export const getFriendCount = async () => {
  try {
    const userData = localStorage.getItem("user");
    const currentUser = JSON.parse(userData);
    const response = await axiosAPI.get(
      `/api/users/${currentUser.idUser}/friends/count`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy số lượng bạn bè:", error);
    return 0;
  }
};
export const searchUsersByName = async (fullName) => {
  try {
    const userData = localStorage.getItem("user");
    const currentUser = JSON.parse(userData);

    // Gọi API tìm kiếm người dùng theo fullName
    const response = await axiosAPI.get(`/api/users/search-by-name`, {
      params: {
        fullName: fullName,
        currentUserId: currentUser.idUser,
      },
    });

    console.log("Kết quả tìm kiếm theo tên:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);
    throw error;
  }
};
export const getFriendsList = async (idUser) => {
  try {
    const response = await axiosAPI.get(`/api/users/${idUser}/friends`);
    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè:", error);
    return [];
  }
};
export const getUserInfo = async (userId) => {
  try {
    const response = await axiosAPI.get(`/api/users/${userId}/info`);
    return (
      response.data || {
        introduction: "",
        education: "",
        location: "",
      }
    );
  } catch (error) {
    console.error("Lỗi khi lấy thông tin:", error);
    return {
      introduction: "",
      education: "",
      location: "",
    };
  }
};

export const getUserPublicProfile = async (userId) => {
  const emptyData = {
    fullName: "",
    avatar: "",
    background: "",
  };

  try {
    const { data } = await axiosAPI.post(`/api/info-user`, { idUser: userId });

    if (data.length === 0) return emptyData;
    return data[0];
  } catch (error) {
    console.error("Lỗi khi lấy thông tin:", error);
    return emptyData;
  }
};

export const updateUserInfo = async (userId, info) => {
  if (!userId) {
    throw new Error("ID người dùng là bắt buộc");
  }
  try {
    const response = await axiosAPI.put(`/api/users/${userId}/info`, info);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    throw error;
  }
};
export const updateUserAvatar = async (formData) => {
  try {
    const userId = formData.get("userId");
    console.log("Gửi yêu cầu cập nhật ảnh đại diện cho người dùng:", userId);

    const response = await axiosAPI.post(
      `/api/users/${userId}/update-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Phản hồi từ máy chủ:", response);
    return response; // Trả về toàn bộ response thay vì response.data
  } catch (error) {
    console.error("Lỗi API:", error.response || error);
    throw error;
  }
};

export const updateUserCover = async (formData) => {
  try {
    const userId = formData.get("userId");
    console.log("Gửi yêu cầu cập nhật ảnh bìa cho người dùng:", userId);

    const response = await axiosAPI.post(
      `/api/users/${userId}/update-cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Phản hồi từ máy chủ:", response);
    return response; // Trả về toàn bộ response thay vì response.data
  } catch (error) {
    console.error("Lỗi API:", error.response || error);
    throw error;
  }
};

export const unfriendUser = async (friendId) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.idUser;
    if (!userId) {
      throw new Error("Không tìm thấy ID người dùng");
    }
    const response = await axiosAPI.delete(`/api/users/${userId}/friends/${friendId}`);
    console.log("Phản hồi từ máy chủ:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi hủy kết bạn:", error);
    throw error;
  }
};
