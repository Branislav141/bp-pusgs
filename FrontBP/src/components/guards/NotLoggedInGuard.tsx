import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { useTokenStore } from "../../store/useTokenStore";

export default function NotLoggedInGuard() {
  const token = useTokenStore().token;

  if (!!token) return <Navigate to={"/dashboard"} />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
