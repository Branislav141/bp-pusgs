import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../models/User";
import { useTokenStore } from "../../store/useTokenStore";
import DashboardCSS from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<User>(
          "http://localhost:5000/api/Users/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const goToUserList = () => {
    navigate("/dashboard/userList");
  };

  const isAdmin = user?.accountType === "administrator";

  return (
    <div className={DashboardCSS.container}>
      {user ? (
        <div className={DashboardCSS["user-info"]}>
          <h1>User info</h1>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Username: {user.userName}</p>
          <p>Surname: {user.surname}</p>
          <p>Birthday: {user.birthday}</p>
          <p>Adress: {user.address}</p>
          {user.photoUser ? (
            <div className={DashboardCSS["user-photo"]}>
              <img src={user.photoUser.url} alt="User" />
            </div>
          ) : (
            <p>No photo available</p>
          )}
          {isAdmin && (
            <button
              className={DashboardCSS["admin-button"]}
              onClick={goToUserList}
            >
              User List
            </button>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
