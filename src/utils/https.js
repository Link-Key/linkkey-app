import axios from "axios";
import ToastMention from "../components/ToastMessage";
import store from "../store";

// create axios instance
const http = axios.create({
  baseURL: "",
  // request connect timeout
  timeout: 2 * 60 * 1000,
  // 表示跨域请求时是否需要使用凭证，开启后，后端服务器要设置允许开启
  // withCredentials: true,
});

http.interceptors.request.use(
  (config) => {
    if (store.getState().userInfo.token) {
      config.headers.Authorization = `Bearer ${
        store.getState().userInfo.token
      }`;
    }
    return config;
  },
  (error) => {
    console.warn(error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    ToastMention({
      message: error.message,
      type: "error",
    });

    return Promise.reject(error);
  }
);

export default http;
