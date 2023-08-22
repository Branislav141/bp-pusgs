import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../../models/User";
import { useTokenStore } from "../../store/useTokenStore";
import styles from "./UserList.module.css";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const response = await axios.get("http://localhost:5000/api/Users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const filteredUsers = response.data.filter(
        (user: User) => user.accountType === "prodavac"
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function approveUser(email: string) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Users/approve",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User approved:", response.data);
      getUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function declineUser(email: string) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Users/decline",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User declined:", response.data);
      getUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className={styles.userListContainer}>
      <h2 className={styles.userListTitle}>User List</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Account Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.accountStatus}</td>
              <td>
                {user.accountStatus === "Pending" && (
                  <div className={styles.buttons}>
                    <button
                      className={styles.userListButton}
                      onClick={() => approveUser(user.email)}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.userListButton}
                      onClick={() => declineUser(user.email)}
                    >
                      Decline
                    </button>
                  </div>
                )}
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.backButton} onClick={goBack}>
        Back
      </button>
    </div>
  );
}

export default UserList;
