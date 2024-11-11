import axios from "axios";

const configAxios = {
  baseUrl: "http://localhost:5000",
  header: {
    "Content-Type": "application/json",
  },
};

const axiosAPI = axios.create(configAxios);

axiosAPI.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

export default axiosAPI;
