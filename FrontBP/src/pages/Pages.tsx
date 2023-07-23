import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../components/login/LoginPage";
import LoggedInGuard from "../components/guards/LoggedInGuard";
import "../pages/Pages.css";
import RegisterPage from "../components/register/RegisterPage";
import Dashboard from "../components/dashboard/Dashboard";
import NotLoggedInGuard from "../components/guards/NotLoggedInGuard";
import EditProfileForm from "../components/userProfile/EditProfileForm";
import UserList from "../components/Users/UserList";
import AddArticle from "../components/Article/AddArticle";
import GetArticles from "../components/Article/GetArticles";
import { useState, useEffect } from "react";

export default function Pages() {
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("userEmail") || "";
  });

  useEffect(() => {
    localStorage.setItem("userEmail", userEmail);
  }, [userEmail]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
  };

  return (
    <>
      <Routes>
        <Route element={<NotLoggedInGuard />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Route>

        <Route element={<LoggedInGuard />}>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/edit-profile" element={<EditProfileForm />} />
          <Route path="/dashboard/userList" element={<UserList />} />
          <Route path="/dashboard/addArticle" element={<AddArticle />} />
          <Route
            path="/dashboard/oldOrders"
            element={<GetArticles userEmail={userEmail} />}
          />
        </Route>
      </Routes>
    </>
  );
}
