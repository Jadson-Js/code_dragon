import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./routes/dashboard/Dashboard";
import Signup from "./routes/auth/Signup";
import VerifyEmailPending from "./routes/auth/VerifyEmailPending";
import VerifyEmail from "./routes/auth/VerifyEmail";
import Login from "./routes/auth/Login";
import ForgotPassword from "./routes/auth/ForgotPassword";
import ResetPassword from "./routes/auth/ResetPassword";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPending />} />
        <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
