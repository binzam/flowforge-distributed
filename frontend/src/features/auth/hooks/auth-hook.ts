import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../lib/query-client";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  signUpUser,
} from "../services/auth-queries";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Get Logged in User
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

// Login
export const useLoginUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
  });
};

export const useSignUpUser = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      toast.success("User registered successfully. Continue to login");
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};

// Logout
export const useLogoutUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};
