import axios from "axios";

const axiosInstance = axios.create({
  // Use the Next.js public prefix, and fallback to 5000 if it's missing!
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
});

export default axiosInstance;