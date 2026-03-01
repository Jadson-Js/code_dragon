import * as React from "react";
import { useParams } from "react-router";
import { useVerifyToken } from "@/features/auth/hooks/useVerifyToken";
import AuthSuccessVerifyToken from "@/features/auth/components/AuthSuccessVerifyToken";

export default function VerifyTokenEmailVerification() {
  const { verifyToken, status } = useVerifyToken();
  const { token } = useParams();

  React.useEffect(() => {
    verifyToken(token as string);
  }, [token]);

  return <AuthSuccessVerifyToken />;
}
