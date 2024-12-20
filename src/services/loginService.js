import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const requestOTP = async (email) => {
  return await axios.post(`${BASE_URL}/forgotten`, { email });
};
export const getUserInfo = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/${userId}`);
    console.log("Get user info response:", response.data); // Log để debug
    return {
      data: {
        ...response.data,
        fullName: response.data.fullName,
        background: response.data.background,
        avatar: response.data.avatar,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email, otp, infoDevice) => {
  try {
    console.log("Sending verify OTP request with:", { email, otp, infoDevice });
    const response = await axios.post(`${BASE_URL}/verify-otp`, {
      email,
      otp,
      infoDevice,
    });
    console.log("Verify OTP response:", response);
    return response;
  } catch (error) {
    console.log("Verify OTP error:", error);
    if (error.response) {
      console.log("Error response:", error.response.data);
      console.log("Error status:", error.response.status);
    }
    throw error;
  }
};

export const changePassword = async (email, otp, newPassword) => {
  return await axios.post(`${BASE_URL}/change-password`, {
    email,
    otp,
    newPassword,
  });
};

export const signUp = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/v1/auth/register`, formData);
    console.log(response.data + "gsdgs");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Sign up failed.");
  }
};

export const checkMail = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/checkmail`, formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Sign up failed.");
  }
};

export const login = async (email, password, visitorId) => {
  try {
    const responses = await axios.post(`${BASE_URL}/v1/auth/login`, {
      email,
      password,
      ip: visitorId,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return responses.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed.");
  }
};
// In loginService.js
export const getConversationPartner = async (currentUserId) => {
  console.log("currentUserId:", currentUserId);
  try {
    const response = await axios.get(
      `${BASE_URL}/api/conversations/partner/${currentUserId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching conversation partner:", error);
    throw error;
  }
};
