import { Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import LoggedInGuard from "../components/guards/LoggedInGuard";
import Navbar from "../components/navbar/Navbar";
import "../pages/Pages.css";
import RegisterPage from "./RegisterPage";
import Dashboard from "../components/dashboard/Dashboard";
export default function Pages() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<LoggedInGuard />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
}
