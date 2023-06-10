import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";

function RegisterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    dateOfBirth: "",
    address: "",
    accountType: "",
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleUpload() {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        // Replace the URL with your file upload endpoint
        const response = await axios.post(
          "YOUR_FILE_UPLOAD_ENDPOINT",
          formData
        );
        console.log("File uploaded:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      // Replace the URL with your registration endpoint
      const response = await axios.post(
        "http://localhost:5000/api/Auth/register",
        formData
      );
      console.log("Registration successful:", response.data);
      // You can perform additional actions after successful registration
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error
    }
  }

  return (
    <div>
      <form className="RegisterForm" onSubmit={handleSubmit}>
        <br />

        <label>Username</label>
        <input
          type="text"
          className="username"
          placeholder="enter your username"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          className="email"
          placeholder="enter your email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          className="password"
          type="password"
          placeholder="enter your password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label>Name</label>
        <input
          type="text"
          className="name"
          placeholder="enter your name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Surname</label>
        <input
          type="text"
          className="surname"
          placeholder="enter your surname"
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />

        <label>Date of birth</label>
        <input
          type="date"
          className="dateOfBirth"
          placeholder="enter your date of birth"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          className="address"
          placeholder="enter your address"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>Account type</label>
        <select
          className="accountType"
          id="accountType"
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
        >
          <option value="">Select Account Type</option>
          <option value="administrator">Administrator</option>
          <option value="prodavac">Prodavac</option>
          <option value="kupac">Kupac</option>
        </select>

        <div>
          <h2>Upload Picture</h2>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleUpload}>
            Upload
          </button>
        </div>

        <input type="submit" className="registerbutton" value="Register" />
      </form>
    </div>
  );
}

export default RegisterPage;
