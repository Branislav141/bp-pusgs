import React from "react";
import { Link } from "react-router-dom";
import NavbarCSS from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={NavbarCSS.navbar}>
      <ul className={NavbarCSS.navlinks}>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
}
