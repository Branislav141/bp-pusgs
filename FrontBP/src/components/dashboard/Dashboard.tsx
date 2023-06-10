import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../models/User";

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/Users/user/{id}"
        );
        setUsers(response.data);
      } catch (error) {
        // Handle any errors from the UserService
        console.error("Error getting users:", error);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <h1>User data:</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            name:{user.name}
            <br />
            email:{user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
