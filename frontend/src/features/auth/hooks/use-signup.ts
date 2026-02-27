import { useMutation } from "@tanstack/react-query";
import { API_SIGNUP } from "../api/signup";
import { useNavigate } from "react-router";
import type { SignupValues } from "../schemas/signup-schema";

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignupValues) => API_SIGNUP(data),
    onSuccess: () => {
      navigate("/verify-email");
    },
    onError: (err) => {
      console.log(err);
    },
  });
}
