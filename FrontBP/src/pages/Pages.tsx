import { Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import LoggedInGuard from "../components/guards/LoggedInGuard";
import Navbar from "../components/navbar/Navbar";
import "../pages/Pages.css";
import RegisterPage from "./RegisterPage";
export default function Pages() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<LoggedInGuard />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  );
}
