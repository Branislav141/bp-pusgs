import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTokenStore } from "../../store/useTokenStore";

const EditProfileForm = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    // Fetch user data and populate form fields
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
        setUserName(userData.userName);
        setEmail(userData.email);
        setName(userData.name);
        setSurname(userData.surname);
        setBirthday(formatDate(userData.birthday));
        setAddress(userData.address);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create an object with the updated profile data
    const updatedProfile = {
      userName,
      email,
      name,
      surname,
      birthday,
      address,
    };

    // Make a request to update the profile
    axios
      .post("http://localhost:5000/api/Users/user/update", updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle success
        console.log("Profile updated successfully");
        // You can redirect the user to the profile page or display a success message
      })
      .catch((error) => {
        // Handle error
        console.error("Failed to update profile", error);
        // Display an error message to the user
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
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
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfileForm;
