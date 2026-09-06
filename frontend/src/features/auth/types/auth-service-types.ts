export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  role: "customer" | "admin" | "warehouse";
}

export interface GetUserResponse {
  data: {
    user: User;
  };
}
export interface LoginUserResponse {
  data: {
    user: User;
  };
}
