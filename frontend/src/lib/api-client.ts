import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { queryClient } from "./query-client";

const REST_API_URL = import.meta.env.VITE_BASE_URL + "/api";

if (import.meta.env.VITE_BASE_URL == null) {
  throw new Error("ENV VARIABLE NOT FOUND");
}

const defaultConfig = {
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const apiClient = axios.create({
  baseURL: REST_API_URL,
  ...defaultConfig,
});

const refreshClient = axios.create({
  baseURL: REST_API_URL,
  withCredentials: true,
  timeout: 10000,
});

const handleGlobalLogout = () => {
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== "user",
  });
  queryClient.setQueryData(["user"], null);
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const setupInterceptors = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        !(originalRequest._retry ?? false)
      ) {
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => client(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await refreshClient.put("/auth/sessions", {});
          processQueue(null);
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          handleGlobalLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );
};

setupInterceptors(apiClient);
