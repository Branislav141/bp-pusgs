import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div>
      <form className="Form">
        <br />

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
