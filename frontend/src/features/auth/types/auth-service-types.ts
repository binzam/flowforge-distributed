export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserResponse {
  data: {
    user: User;
  };
}
