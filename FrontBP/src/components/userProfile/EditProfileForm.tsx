import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTokenStore } from "../../store/useTokenStore";
import styles from "./EditProfileForm.module.css";
import { useNavigate } from "react-router-dom";

const EditProfileForm: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

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
        setUserName(userData.userName || "");
        setEmail(userData.email || "");
        setName(userData.name || "");
        setSurname(userData.surname || "");
        const formattedBirthday = userData.birthday
          ? userData.birthday.split("T")[0]
          : "";
        setBirthday(formattedBirthday);
        setAddress(userData.address || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile = {
      userName,
      email,
      name,
      surname,
      birthday: new Date(birthday),
      address,
    };

    axios
      .post("http://localhost:5000/api/Users/user/update", updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Profile updated successfully");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Failed to update profile", error);
      });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1>Edit user data</h1>
      <div>
        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="surname">Surname:</label>
        <input
          type="text"
          id="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="birthday">Birthday:</label>
        <input
          type="date"
          id="birthday"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.button}>
        Save
      </button>
    </form>
  );
};

export default EditProfileForm;
