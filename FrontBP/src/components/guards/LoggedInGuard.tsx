import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function LoggedInGuard() {
  const jwt = null;

  if (!jwt) return <Navigate to={"/login"} />;

  return <Outlet />;
}
