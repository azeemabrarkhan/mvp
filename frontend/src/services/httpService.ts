import axios from "axios";
import { toast } from "react-toastify";
import config from "../config.json";

const http = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

http.interceptors.response.use(null, (error) => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

  if (!expectedError) {
    toast.error("Something unexpected happened!");
  }

  return Promise.reject({ status: error.response.status, error: error.response.data?.error });
});

export default http;
