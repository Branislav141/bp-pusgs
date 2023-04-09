import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import LoggedInGuard from "../components/guards/LoggedInGuard";

export default function Pages() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<LoggedInGuard />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
