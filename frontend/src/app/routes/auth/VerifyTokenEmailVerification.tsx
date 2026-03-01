import * as React from "react";
import { useParams } from "react-router";
import { useVerifyToken } from "@/features/auth/hooks/useVerifyToken";
import AuthSuccessVerifyTokenScreen from "@/features/auth/components/AuthSuccessVerifyTokenScreen";
import AuthPendingVerifyTokenScreen from "@/features/auth/components/AuthPendingVerifyTokenScreen";
import AuthErrorVerifyTokenScreen from "@/features/auth/components/AuthErrorVerifyTokenScreen";

export default function VerifyTokenEmailVerification() {
  const { verifyToken, status } = useVerifyToken();
  const { token } = useParams();

  React.useEffect(() => {
    verifyToken(token as string);
  }, [token]);

  if (status === "pending") {
    return <AuthPendingVerifyTokenScreen />;
  }

  if (status === "error") {
    return <AuthErrorVerifyTokenScreen />;
  }

  return <AuthSuccessVerifyTokenScreen />;
}
