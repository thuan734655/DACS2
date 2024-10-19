import axios from "axios";

const BASE_URL = "http://localhost:7749";

export const requestOTP = async (email) => {
  return await axios.post(`${BASE_URL}/requestOTP`, { email });
};

export const verifyOTP = async (email, otp, infoDevice) => {
  return await axios.post(`${BASE_URL}/verify-otp`, { email, otp, infoDevice });
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
    return await axios.post(`${BASE_URL}/login`, {
      email,
      password,
      ip: visitorId,
    });
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed.");
  }
};
