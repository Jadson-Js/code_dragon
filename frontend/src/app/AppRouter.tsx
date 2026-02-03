import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "./routes/auth/Signup";
import Dashboard from "./routes/dashboard/Dashboard";

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
