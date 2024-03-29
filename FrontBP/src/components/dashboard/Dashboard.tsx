import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../models/User";
import { useTokenStore } from "../../store/useTokenStore";
import DashboardCSS from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<User>(
        "http://localhost:5000/api/Users/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userData = response.data;
      userData.birthday = new Date(userData.birthday);

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formatDate = (birthday: Date): string => {
    const year = birthday.getFullYear();
    const month = String(birthday.getMonth() + 1).padStart(2, "0");
    const day = String(birthday.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const goToUserList = () => {
    navigate("/dashboard/userList");
  };

  const isAdmin = user?.accountType === "administrator";
  const isProdavac = user?.accountType === "prodavac";
  const isKupac = user?.accountType === "kupac";

  const goToAddArticle = () => {
    navigate("/dashboard/addArticle");
  };

  const goToMyArticles = () => {
    navigate("/dashboard/myArticles");
  };
  const goToShop = () => {
    navigate("/dashboard/Shop");
  };

  const goToAllOrders = () => {
    navigate("/dashboard/AllOrders");
  };

  const goToMyOrdersSeller = () => {
    navigate("/dashboard/SellerOrders");
  };

  const SellerOrdersStatusPending = () => {
    navigate("/dashboard/SellerOrdersStatusPending");
  };

  const goToMyOldOrdersBuyer = () => {
    navigate("/dashboard/BuyerOrders");
  };
  const goToMyNewOrdersBuyer = () => {
    navigate("/dashboard/NewBuyerOrders");
  };

  return (
    <div className={DashboardCSS.container}>
      {user ? (
        <div className={DashboardCSS["user-info"]}>
          <h1>{user.name} info</h1>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Username: {user.userName}</p>
          <p>Surname: {user.surname}</p>
          <p>Birthday: {formatDate(user.birthday)}</p>
          <p>Address: {user.address}</p>
          {user.photoUser ? (
            <div className={DashboardCSS["user-photo"]}>
              <img src={user.photoUser.url} alt="User" />
            </div>
          ) : (
            <p>No photo available</p>
          )}
          {isAdmin && (
            <>
              <button
                className={DashboardCSS["admin-button"]}
                onClick={goToUserList}
              >
                User List
              </button>
              <button
                className={DashboardCSS["admin-button"]}
                onClick={goToAllOrders}
              >
                All Orders
              </button>
            </>
          )}
          {isProdavac && (
            <>
              <button
                className={DashboardCSS["prodavac-button"]}
                onClick={goToAddArticle}
              >
                Add Article
              </button>
              <button
                className={DashboardCSS["prodavac-button"]}
                onClick={goToMyArticles}
              >
                My Articles
              </button>
              <button
                className={DashboardCSS["prodavac-button"]}
                onClick={goToMyOrdersSeller}
              >
                My Orders
              </button>

              <button
                className={DashboardCSS["prodavac-button"]}
                onClick={SellerOrdersStatusPending}
              >
                My Orders on pending
              </button>
            </>
          )}
          {isKupac && (
            <>
              <button
                className={DashboardCSS["prodavac-button"]}
                onClick={goToShop}
              >
                Shop
              </button>
              <button
                className={DashboardCSS["prodavac-button"]}
                onClick={goToMyOldOrdersBuyer}
              >
                Old orders
              </button>

              <button
                className={DashboardCSS["prodavac-button"]}
                onClick={goToMyNewOrdersBuyer}
              >
                New orders
              </button>
            </>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
