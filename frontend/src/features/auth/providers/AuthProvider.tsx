import { type ReactNode } from "react";
import { useGetCurrentUser } from "../hooks/auth-hook";
import type { User } from "../types/auth-service-types";
import { AuthContext } from "./AuthContext";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useGetCurrentUser();
  return (
    <AuthContext.Provider value={{ user: data?.data.user ?? null, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
