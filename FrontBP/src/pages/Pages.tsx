import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../components/login/LoginPage";
import LoggedInGuard from "../components/guards/LoggedInGuard";
import "../pages/Pages.css";
import RegisterPage from "../components/register/RegisterPage";
import Dashboard from "../components/dashboard/Dashboard";
import NotLoggedInGuard from "../components/guards/NotLoggedInGuard";
import EditProfileForm from "../components/userProfile/EditProfileForm";
export default function Pages() {
  const user = {
    userName: "",
    email: "",
    name: "",
    surname: "",
    birthday: "",
    address: "",
  };
  return (
    <>
      <Routes>
        <Route element={<NotLoggedInGuard />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<LoggedInGuard />}>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/edit-profile"
            element={<EditProfileForm user={user} />}
          />
        </Route>
      </Routes>
    </>
  );
}
