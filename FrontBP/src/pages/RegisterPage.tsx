import React, { useState } from "react";
import "./RegisterPage.css";
function RegisterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  function handleUpload() {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Perform upload logic here
      console.log("Uploading file:", selectedFile);
      // You can send the file to an API endpoint or perform other actions
    }
  }

  return (
    <div>
      <form className="RegisterForm">
        <br />

        <label>Username</label>
        <input
          type="text"
          className="username"
          placeholder="enter your username"
          id="username"
        ></input>

        <label>Email</label>
        <input
          type="email"
          className="email"
          placeholder="enter your email"
          id="email"
        ></input>

        <label>Password</label>
        <input
          className="password"
          type="password"
          placeholder="enter your password"
        ></input>

        <label>Name</label>
        <input
          type="text"
          className="name"
          placeholder="enter your name"
          id="name"
        ></input>

        <label>Surname</label>
        <input
          type="text"
          className="surname"
          placeholder="enter your surname"
          id="surname"
        ></input>

        <label>Date of birth</label>
        <input
          type="date"
          className="dateOfBirth"
          placeholder="enter your date of birth"
          id="dateOfBirth"
        ></input>

        <label>Adress</label>
        <input
          type="text"
          className="adress"
          placeholder="enter your adress"
          id="adress"
        ></input>

        <div>
          <h2>Upload Picture</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>

        <input type="submit" className="registerbutton" value="Register" />
      </form>
    </div>
  );
}

export default RegisterPage;
