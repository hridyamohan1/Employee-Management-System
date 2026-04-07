import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

AxiosInstance.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh }
          );

          const newAccess = res.data.access;
          localStorage.setItem("access_token", newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;