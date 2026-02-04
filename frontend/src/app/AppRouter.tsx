import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "./routes/auth/Signup";
import Dashboard from "./routes/dashboard/Dashboard";
import Login from "./routes/auth/Login";
import ForgotPassword from "./routes/auth/ForgotPassword";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
