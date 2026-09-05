import axios from "axios";
import { getApiError } from "./api-error";

const baseURL = import.meta.env.VITE_BASE_URL;

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    throw getApiError(error);
  },
);
