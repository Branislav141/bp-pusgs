import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTokenStore } from "../../store/useTokenStore";
import styles from "./EditProfileForm.module.css";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";

const EditProfileForm: React.FC = () => {
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
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

      const userData = response.data;
      userData.birthday = new Date(userData.birthday);

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setNewImageFile(file);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userName", user?.userName || "");
      formData.append("email", user?.email || "");
      formData.append("name", user?.name || "");
      formData.append("surname", user?.surname || "");
      formData.append("birthday", formatDate(new Date(user?.birthday || "")));
      formData.append("address", user?.address || "");
      if (newImageFile) {
        formData.append("imageFile", newImageFile);
      }

      await axios.put("http://localhost:5000/api/Users/user/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("User updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <form className={styles.container} onSubmit={handleFormSubmit}>
      <h1>Edit user data</h1>
      <div>
        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          id="userName"
          name="name"
          value={user?.userName}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="surname">Surname:</label>
        <input
          type="text"
          id="surname"
          name="surname"
          value={user.surname}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="birthday">Birthday:</label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={formatDate(user.birthday)}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={user.address}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label>Current Image:</label>
        {user.photoUser ? (
          <div className={styles.imageContainer}>
            <img src={user.photoUser.url} alt={user.name} />
          </div>
        ) : (
          <p>No photo available</p>
        )}
      </div>
      <div>
        <label>Upload New Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button type="submit" className={styles.button}>
        Save
      </button>
    </form>
  );
};

export default EditProfileForm;
