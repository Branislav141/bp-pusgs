import React from "react";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div>
      <form className="Form">
        <br />
        <label>Username</label>
        <input type="text" placeholder="enter your username"></input>

        <label>Email</label>
        <input
          type="email"
          className="email"
          placeholder="enter your email"
        ></input>

        <input type="submit" className="loginbutton" value="Login" />
        <hr></hr>

        <div className="or">Or sign with:</div>
        <br />
        <div>
          <button className="faceicon"></button>
        </div>
      </form>
    </div>
  );
}
