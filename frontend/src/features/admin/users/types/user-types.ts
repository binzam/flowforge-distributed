export interface UsersQuery {
  role?: "admin" | "customer" | "warehouse";
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
}
export interface UserDetailResponse {
  data: User;
}
