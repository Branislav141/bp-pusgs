import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../models/User";
import { useTokenStore } from "../../store/useTokenStore";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
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

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {/* Display other user data */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
