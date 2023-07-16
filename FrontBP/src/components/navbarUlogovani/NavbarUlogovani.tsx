import React, { useState } from "react";
import NavbarUlogovaniCSS from "./NavbarUlogovani.module.css";
import menuIcon from "../../photos/slikaAcc.png";
import { removeToken } from "../../store/useTokenStore";
import { useNavigate } from "react-router-dom";

export default function NavbarUlogovani() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    removeToken();
    console.log("Logout clicked");
  };

  const handleEditData = () => {
    navigate("/dashboard/edit-profile");
  };

  return (
    <nav className={NavbarUlogovaniCSS.navbarU}>
      <button
        className={NavbarUlogovaniCSS.menuButton}
        onClick={handleButtonClick}
      >
        <img
          src={menuIcon}
          alt="Menu Icon"
          className={NavbarUlogovaniCSS.menuIc}
        />
        Profile
      </button>
      {isMenuOpen && (
        <ul className={NavbarUlogovaniCSS.menuO}>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
          <li>
            <button onClick={handleEditData}>Edit data</button>
          </li>
        </ul>
      )}
    </nav>
  );
}
