import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsers } from "../services/user-services";
import type { UsersQuery } from "../types/user-types";

export const useGetUsers = (query: UsersQuery) =>
  useQuery({
    queryKey: ["users", "all", query],
    queryFn: () => getUsers(query),
  });

export const useGetUserById = (id: string) =>
  useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
