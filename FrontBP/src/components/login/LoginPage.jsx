import { Link } from "react-router-dom";
import LoginPageCSS from "./LoginPage.module.css";
import { useState } from "react";
import axios from "axios";
import { setToken } from "../../store/useTokenStore";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [loginSuccess, setLoginSucces] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Auth/login",
        { email, password }
      );

      const token = response.data.token;

      setEmail("");
      setPassword("");

      setToken(token);
      window.alert("Login successful!");
      setLoginSucces(true);
    } catch (error) {
      console.error("Login failed", error);
      setLoginSucces(false);
    } finally {
      setModalOpen(true);
    }
  };

  function closeModal() {
    setModalOpen(false);
  }
  return (
    <div>
      <form onSubmit={handleLogin} className={LoginPageCSS.Form}>
        <br />

        <label>Email</label>
        <input
          type="email"
          className={LoginPageCSS.email}
          placeholder="enter your email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>

        <label>Password</label>
        <input
          className={LoginPageCSS.password}
          type="password"
          placeholder="enter your password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <input
          type="submit"
          className={LoginPageCSS.loginbutton}
          value="Login"
        />
        <hr></hr>

        <div className={LoginPageCSS.or}>Or sign with:</div>
        <br />
        <div>
          <button className={LoginPageCSS.faceicon}></button>
        </div>

        <hr></hr>

        <div>
          <Link to="/register">
            <button className={LoginPageCSS.regButton}>Regiser</button>
          </Link>
        </div>
      </form>

      {isModalOpen && (
        <div className={LoginPageCSS.modal}>
          <div className={LoginPageCSS.modalContent}>
            {loginSuccess ? (
              <></>
            ) : (
              <>
                <h3>Login Failed</h3>
                <p>Sorry, login failed. Please try again.</p>
                <button onClick={closeModal}>Close</button>
              </>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
