import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../components/login/LoginPage";
import LoggedInGuard from "../components/guards/LoggedInGuard";
import "../pages/Pages.css";
import RegisterPage from "../components/register/RegisterPage";
import Dashboard from "../components/dashboard/Dashboard";
import NotLoggedInGuard from "../components/guards/NotLoggedInGuard";
import EditProfileForm from "../components/userProfile/EditProfileForm";
import UserList from "../components/Users/UserList";
import AddArticle from "../components/Article/AddArticle/AddArticle";
import GetMyArticles from "../components/Article/GetMyArticles/GetMyArticles";
import { useState, useEffect } from "react";
import EditArticle from "../components/Article/EditArticle/EditArticle";
import AllArticles from "../components/Article/AllArticles/AllArticles";
import ShoppingCart from "../components/ShoppingCart/Cart/ShoppingCart";
import AllOrders from "../components/Order/AllOrders";
import SellerOrders from "../components/Order/SellerOrders/SellerOrders";
import BuyerOrders from "../components/Order/BuyerOrders/BuyerOrders";
import NewOrdersBuyer from "../components/Order/BuyerOrders/NewOrdersBuyer/NewOrdersBuyer";
import { useTokenStore } from "../store/useTokenStore";

import SellerOrdersStatusPending from "../components/Order/SellerOrders/SellerOrdersOnPending/SellerOrdersOnPending";

export default function Pages() {
  const accountType = useTokenStore((state) => state.accountType);

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

          {accountType === "administrator" && (
            <>
              <Route path="/dashboard/userList" element={<UserList />} />
              <Route path="/dashboard/AllOrders" element={<AllOrders />} />
            </>
          )}

          {accountType === "kupac" && (
            <>
              <Route path="/dashboard/Shop" element={<AllArticles />} />{" "}
              <Route
                path="/dashboard/shoppingCart"
                element={<ShoppingCart />}
              />
              <Route path="/dashboard/BuyerOrders" element={<BuyerOrders />} />
              <Route
                path="/dashboard/NewBuyerOrders"
                element={<NewOrdersBuyer />}
              />
            </>
          )}

          {accountType === "prodavac" && (
            <>
              <Route
                path="/dashboard/SellerOrders"
                element={<SellerOrders />}
              />
              <Route
                path="/dashboard/SellerOrdersStatusPending"
                element={<SellerOrdersStatusPending />}
              />

              <Route path="/dashboard/addArticle" element={<AddArticle />} />
              <Route
                path="/dashboard/myArticles"
                element={<GetMyArticles userEmail={userEmail} />}
              />
              <Route
                path="/dashboard/myArticles/editArticle/:articleId"
                element={<EditArticle />}
              />
            </>
          )}
        </Route>
      </Routes>
    </>
  );
}
