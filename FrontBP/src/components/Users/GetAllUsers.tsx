import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../models/User";

const GetAllUsers = () => {
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Users/all");
        setUser(response.data);
      } catch (error) {
        // Handle any errors from the UserService
        console.error("Error getting users:", error);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {user.map((user) => (
          <li key={user.id}>
            {user.name},{user.email},{user.surname}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllUsers;
