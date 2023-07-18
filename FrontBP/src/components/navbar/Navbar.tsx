// Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import NavbarCSS from "./Navbar.module.css";
import logo from "../../photos/bplogo.jpg"; // Replace with the path to your logo image

const Navbar: React.FC = () => {
  return (
    <nav className={NavbarCSS.navbar}>
      <div className={NavbarCSS.logoContainer}>
        <img src={logo} alt="Logo" className={NavbarCSS.logo} />
      </div>
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
};

export default Navbar;
