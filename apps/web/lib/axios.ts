import axios from "axios";

export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
  // Check if the code is running in the browser.
  // localStorage is only available in the browser environment.
  // Without this check, accessing localStorage on the server
  // (e.g., during Next.js SSR) will cause a ReferenceError.
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
