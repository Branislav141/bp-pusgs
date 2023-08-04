import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTokenStore } from "../../store/useTokenStore";
import NavbarUlogovani from "../navbarUlogovani/NavbarUlogovani";

export default function LoggedInGuard() {
  const token = useTokenStore().token;

  if (!token) return <Navigate to={"/login"} />;

  return (
    <>
      <NavbarUlogovani></NavbarUlogovani>
      <Outlet />
    </>
  );
}
