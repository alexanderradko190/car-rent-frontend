import axios from "axios";
import router from "../router";
import { authStore } from "../store/authStore";
import { notify } from "../store/notificationStore";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api"
});

httpClient.interceptors.request.use((config) => {
  const token = authStore.token();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const extractMessage = (data, fallback) => {
  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }
  if (data?.message) return data.message;
  if (data?.detail) return data.detail;
  if (data?.error) return data.error;
  if (Array.isArray(data?.errors)) return data.errors.join(", ");
  if (data && typeof data === "object") {
    const skipKeys = new Set(["token", "access_token", "refresh_token"]);
    const firstKey = Object.keys(data).find((key) => !skipKeys.has(key));
    if (!firstKey) return fallback;
    const value = data[firstKey];
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string") return value;
  }
  return fallback;
};

const extractSuccessMessage = (data) => {
  if (data?.message) return data.message;
  if (data?.detail) return data.detail;
  return "Успешно";
};

const isMutating = (config) => {
  const method = config?.method?.toLowerCase();
  return ["post", "put", "patch", "delete"].includes(method);
};

httpClient.interceptors.response.use(
  (response) => {
    if (isMutating(response.config)) {
      const url = response.config?.url || "";
      const isAuth =
        url.includes("/auth/login") || url.includes("/auth/register");
      if (!isAuth) {
        const message = extractSuccessMessage(response.data);
        notify.success(message);
      }
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = extractMessage(
      error.response?.data,
      error.message || "Неизвестная ошибка"
    );

    if (status === 401) {
      authStore.clear();
      router.push("/auth/login");
    }

    notify.error(message);
    return Promise.reject(error);
  }
);

export default httpClient;
