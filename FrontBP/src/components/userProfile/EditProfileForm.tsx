import React, { useState } from "react";
import axios from "axios";

interface EditProfileFormProps {
  user: {
    userName: string;
    email: string;
    name: string;
    surname: string;
    birthday: string; // Change the type to string
    address: string;
  };
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [birthday, setBirthday] = useState(user.birthday);
  const [address, setAddress] = useState(user.address);

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
      .post("http://localhost:5000/api/Users/user/update", updatedProfile)
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
          value={birthday} // Ensure the value is a string
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
