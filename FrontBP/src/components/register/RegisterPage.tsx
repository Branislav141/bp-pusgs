import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import RegisterPageCSS from "./RegisterPage.module.css";

interface RegistrationModel {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  birthday: string;
  address: string;
  accountType: string;
  photoUrl: string | null;
}

function RegisterPage() {
  const [passwordTooShort, setPasswordTooShort] = useState(false);

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<RegistrationModel>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    birthday: "",
    address: "",
    accountType: "prodavac",
    photoUrl: null,
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    if (name === "accountType" && value === "kupac") {
      setFormData({ ...formData, accountType: "kupac" });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "password" || name === "confirmPassword") {
      if (formData.password !== formData.confirmPassword) {
        console.log("Passwords do not match");
      }

      if (name === "password" && value.length < 5) {
        setPasswordTooShort(true);
      } else {
        setPasswordTooShort(false);
      }
    }
  }

  async function handleUpload() {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/Auth/uploadPhoto",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setFormData((prevFormData) => ({
          ...prevFormData,
          photoUrl: response.data.photoUrl,
        }));
        toast.success("Photo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading photo. Please try again.");
      }
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", response.data);
      toast.success("Registration successful!");

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        surname: "",
        birthday: "",
        address: "",
        accountType: "prodavac",
        photoUrl: null,
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <div>
      <h1 className={RegisterPageCSS["naslov"]}>Register page</h1>
      <form className={RegisterPageCSS.RegisterForm} onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className={RegisterPageCSS.username}
          placeholder="Enter your username"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          className={RegisterPageCSS.email}
          placeholder="Enter your email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          className={RegisterPageCSS.password}
          type="password"
          placeholder="Enter your password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        {passwordTooShort && (
          <p className={RegisterPageCSS.passwordError}>
            Password must be at least 5 characters long.
          </p>
        )}

        <label>Confirm Password</label>
        <input
          className={RegisterPageCSS.confirmPassword}
          type="password"
          placeholder="Confirm your password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <label>Name</label>
        <input
          type="text"
          className={RegisterPageCSS.name}
          placeholder="Enter your name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Surname</label>
        <input
          type="text"
          className={RegisterPageCSS.surname}
          placeholder="Enter your surname"
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />

        <label>Date of birth</label>
        <input
          type="date"
          className={RegisterPageCSS.date}
          placeholder="Enter your date of birth"
          id="birthday"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          className={RegisterPageCSS.address}
          placeholder="Enter your address"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>Account type</label>
        <select
          className={RegisterPageCSS.accountType}
          id="accountType"
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
        >
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

        <input
          type="submit"
          className={RegisterPageCSS.registerbutton}
          value="Register"
        />
      </form>

      <ToastContainer />
    </div>
  );
}

export default RegisterPage;
