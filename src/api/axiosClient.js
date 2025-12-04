import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://backend-assignment-lmav.onrender.com",
});

export default axiosClient;
