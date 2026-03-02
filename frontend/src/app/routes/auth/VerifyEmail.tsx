import * as React from "react";
import { useParams } from "react-router";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import AuthVerifyEmailSuccess from "@/features/auth/components/AuthVerifyEmailSuccess";
import AuthVerifyEmailPending from "@/features/auth/components/AuthVerifyEmailPending";
import AuthVerifyEmailError from "@/features/auth/components/AuthVerifyEmailError";

export default function VerifyEmail() {
  const { verifyEmail, status } = useVerifyEmail();
  const { token } = useParams();

  React.useEffect(() => {
    verifyEmail(token as string);
  }, [token]);

  if (status === "pending") {
    return <AuthVerifyEmailPending />;
  }

  if (status === "error") {
    return <AuthVerifyEmailError />;
  }

  return <AuthVerifyEmailSuccess />;
}
