import axiosAPI from "./configAxios.js";

export const requestOTP = async (email) => {
  return await axiosAPI.post(`/requestOTP`, { email });
};
export const getInfoUser = async (idUser) => {
  return await axiosAPI.post(`/info-user`, { idUser });
};

export const verifyOTP = async (email, otp, infoDevice) => {
  return await axiosAPI.post(`/verify-otp`, { email, otp, infoDevice });
};

export const changePassword = async (email, otp, newPassword) => {
  return await axiosAPI.post(`/change-password`, {
    email,
    otp,
    newPassword,
  });
};


export const signUp = async (formData) => {
  try {
    const response = await axiosAPI.post(`/v1/auth/register`, formData);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Sign up failed.");
  }
};

export const checkMail = async (formData) => {
  try {
    const response = await axiosAPI.post(`/checkmail`, formData);
    return response;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Check mail failed.");
  }
};

export const login = async (email, password, visitorId) => {
  try {
    const responses = await axiosAPI.post(`/v1/auth/login`, {
     
      email,
      password,
      ip: visitorId,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return responses;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed.");
  }
};
// In loginService.js
export const getConversationPartner = async (currentUserId) => {
  console.log("currentUserId:", currentUserId);
  try {
    const response = await axiosAPI.get(
      `/api/conversations/partner/${currentUserId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching conversation partner:", error);
    throw error;
  }
};
