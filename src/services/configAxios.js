import axios from "axios";

const configAxios = {
  baseURL: "https://dacs2-server-4.onrender.com",
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
