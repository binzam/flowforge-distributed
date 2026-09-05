import { apiClient } from "../../../lib/api-client";
import type { LoginFormValues, SignUpFormValues } from "../schemas/auth-schema";
import type { GetUserResponse } from "../types/auth-service-types";

// Login
export const loginUser = async (data: LoginFormValues) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

// Get Current User
export const getCurrentUser = async (): Promise<GetUserResponse> => {
  const response = await apiClient.get("/auth/me", {});
  return response.data;
};

// Sign up user
export const signUpUser = async (data: SignUpFormValues): Promise<void> => {
  const payload = { ...data };
  delete (payload as Partial<SignUpFormValues>).confirmPassword;

  const response = await apiClient.post("/users", payload);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout", {});
  return response.data;
};
