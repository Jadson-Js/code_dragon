import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./routes/dashboard/Dashboard";
import Signup from "./routes/auth/Signup";
import ResendEmailVerification from "./routes/auth/ResendEmailVerification";
import VerifyTokenEmailVerification from "./routes/auth/VerifyTokenEmailVerification";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/resend-email-verification/:email"
          element={<ResendEmailVerification />}
        />
        <Route
          path="/verify-token/:token"
          element={<VerifyTokenEmailVerification />}
        />
      </Routes>
    </BrowserRouter>
  );
}
