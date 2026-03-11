import * as React from "react";
import { useParams } from "react-router";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import AuthVerifyEmailSuccess from "@/features/auth/components/AuthVerifyEmailSuccess";
import AuthVerifyEmailPending from "@/features/auth/components/AuthVerifyEmailPending";
import AuthVerifyEmailError from "@/features/auth/components/AuthVerifyEmailError";

export default function VerifyEmail() {
  const { mutation } = useVerifyEmail();
  const { token } = useParams();

  React.useEffect(() => {
    mutation.mutate(token as string);
  }, [token]);

  if (mutation.isPending || mutation.isIdle) {
    return <AuthVerifyEmailPending />;
  }

  if (mutation.isError) {
    return <AuthVerifyEmailError />;
  }

  return <AuthVerifyEmailSuccess />;
}
