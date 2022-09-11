import axios from "axios";
import Router from "next/router";
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

const handleCode = (code, msg, errorUrl) => {
  if (code === 10001) {
    Router.push("/");
    console.log("handleCodeMsg:", msg);
    ToastMention({ message: msg, type: "error" });
  }
};

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
    const { data, config } = response;
    const { code, msg: message } = data;

    if (code === 10001) {
      handleCode(code, message, config.url);

      Promise.reject;
    }
    return data;
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
