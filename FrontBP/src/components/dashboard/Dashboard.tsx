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
          },
        }
      );

      // Convert birthday to a Date object
      const userData = response.data;
      userData.birthday = new Date(userData.birthday);

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const goToUserList = () => {
    navigate("/dashboard/userList");
  };

  const isAdmin = user?.accountType === "administrator";
  const isProdavac = user?.accountType === "prodavac";
  const goToAddArticle = () => {
    navigate("/dashboard/addArticle");
  };

  const goToMyArticles = () => {
    navigate("/dashboard/myArticles");
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
          <p>Birthday: {user.birthday.toDateString()}</p>
          <p>Address: {user.address}</p>
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
