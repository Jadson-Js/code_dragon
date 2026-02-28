import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./routes/dashboard/Dashboard";
import Signup from "./routes/auth/Signup";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
