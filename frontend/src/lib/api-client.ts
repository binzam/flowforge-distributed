import axios from "axios";
import { getApiError } from "./api-error";
import { queryClient } from "./query-client";

const REFRESH_QUEUE_TIMEOUT_MS = 10000;
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const baseURL = import.meta.env.VITE_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_BASE_URL environment variable is not defined");
}

export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 10000,
});

// Endpoints that should never trigger a silent refresh-and-retry:
const REFRESH_EXEMPT_URLS = ["/auth/login", "/auth/sign-up", "/auth/refresh"];

const isRefreshExempt = (url: string | undefined): boolean =>
  url != null && REFRESH_EXEMPT_URLS.some((exempt) => url.includes(exempt));

interface RefreshQueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let refreshQueue: RefreshQueueItem[] = [];

const processQueue = (error: unknown | null): void => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw getApiError(error);
    }

    const originalRequest = error.config;

    if (!originalRequest) {
      throw getApiError(error);
    }

    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshExempt(originalRequest.url);

    if (!shouldAttemptRefresh) {
      throw getApiError(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      await new Promise<void>((resolve, reject) => {
        const item: RefreshQueueItem = { resolve, reject };

        const timeoutId = setTimeout(() => {
          refreshQueue = refreshQueue.filter((queued) => queued !== item);
          reject(new Error("Token refresh timed out"));
        }, REFRESH_QUEUE_TIMEOUT_MS);

        item.resolve = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        item.reject = (err: unknown) => {
          clearTimeout(timeoutId);
          reject(err);
        };

        refreshQueue.push(item);
      }).catch((queuedError: unknown) => {
        throw getApiError(queuedError);
      });

      return apiClient(originalRequest);
    }

    isRefreshing = true;

    try {
      await refreshClient.post("/auth/refresh");
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError);
      queryClient.removeQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] !== "user" && query.queryKey[0] !== "products"
          );
        },
      });
      queryClient.setQueryData(["user"], null);
      throw getApiError(refreshError);
    }

    isRefreshing = false;
    processQueue(null);

    return apiClient(originalRequest);
  },
);
