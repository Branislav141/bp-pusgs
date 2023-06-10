import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Auth/login",
        { email, password }
      );
      // Assuming the server returns a token upon successful login
      const token = response.data.token;
      // Store the token in local storage or any other preferred method for authentication

      // Reset the form fields
      setEmail("");
      setPassword("");

      navigate("/dashboard");
      // Perform any necessary actions after successful login, such as redirecting to a different page
    } catch (error) {
      // Handle error, such as displaying an error message to the user
      console.error("Login failed", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleLogin} className="Form">
        <br />

        <label>Email</label>
        <input
          type="email"
          className="email"
          placeholder="enter your email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>

        <label>Password</label>
        <input
          className="password"
          type="password"
          placeholder="enter your password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <input type="submit" className="loginbutton" value="Login" />
        <hr></hr>

        <div className="or">Or sign with:</div>
        <br />
        <div>
          <button className="faceicon"></button>
        </div>

        <hr></hr>

        <div>
          <Link to="/register">
            <button className="regButton">Regiser</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
