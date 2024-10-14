import axios from "axios";

const BASE_URL = "http://localhost:7749";

export const requestOTP = async (email) => {
  return await axios.post(`${BASE_URL}/forgotten`, { email });
};

export const verifyOTP = async (email, otp) => {
  return await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
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
    const response = await axios.post(`${BASE_URL}/signup`, formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Sign up failed.");
  }
};

export const login = async (email, password, visitorId) => {
  try {
    return  await axios.post(`${BASE_URL}/login`, {
      email,
      password,
      ip: visitorId,
    });
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed.");
  }
};