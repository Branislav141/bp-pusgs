import React, { useState } from "react";
import axios from "axios";
import RegisterPageCSS from "./RegisterPage.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RegistrationModel {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  address: string;
  accountType: string;
  photoUrl: string | null;
}

function RegisterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<RegistrationModel>({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    dateOfBirth: "",
    address: "",
    accountType: "",
    photoUrl: null,
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
      // Perform any additional actions after successful registration

      // Reset the form data
      setFormData({
        username: "",
        email: "",
        password: "",
        name: "",
        surname: "",
        dateOfBirth: "",
        address: "",
        accountType: "",
        photoUrl: null,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      // Handle registration error
    }
  }
  return (
    <div>
      <form className={RegisterPageCSS.RegisterForm} onSubmit={handleSubmit}>
        <br />

        <label>Username</label>
        <input
          type="text"
          className={RegisterPageCSS.username}
          placeholder="enter your username"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          className={RegisterPageCSS.email}
          placeholder="enter your email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          className={RegisterPageCSS.password}
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
          className={RegisterPageCSS.name}
          placeholder="enter your name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Surname</label>
        <input
          type="text"
          className={RegisterPageCSS.surname}
          placeholder="enter your surname"
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />

        <label>Date of birth</label>
        <input
          type="date"
          className={RegisterPageCSS.date}
          placeholder="enter your date of birth"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          className={RegisterPageCSS.address}
          placeholder="enter your address"
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
