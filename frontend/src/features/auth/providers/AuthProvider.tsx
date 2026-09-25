import { useMemo, type ReactNode } from "react";
import { useGetCurrentUser } from "../hooks/auth-hook";
import type { User } from "../types/auth-service-types";
import { AuthContext } from "./AuthContext";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useGetCurrentUser();
  const value = useMemo(
    () => ({ user: data?.data.user ?? null, isLoading }),
    [data, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
