import { apiClient } from "@/lib/api-client";
import type {
  UserDetailResponse,
  UsersQuery,
  UsersResponse,
} from "../types/user-types";

export const getUsers = async (query: UsersQuery = {}) => {
  const response = await apiClient.get<UsersResponse>("/users", {
    params: query,
  });
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await apiClient.get<UserDetailResponse>(`/users/${id}`);
  return response.data;
};
