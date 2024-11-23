import axios from 'axios';

const axiosAPI = axios.create({
  baseURL: 'http://localhost:7749/', // Địa chỉ backend
  timeout: 10000,
});

export default axiosAPI;
