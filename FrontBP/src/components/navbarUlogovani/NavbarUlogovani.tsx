import React, { useState } from "react";
import NavbarUlogovaniCSS from "./NavbarUlogovani.module.css";
import menuIcon from "../../photos/slikaAcc.png";
import { removeToken } from "../../store/useTokenStore";
import { useNavigate } from "react-router-dom";
import logo from "../../photos/bplogo.jpg";
import { FaShoppingCart } from "react-icons/fa";
import { useShoppingCart } from "../ShoppingCart/ShoppingCartProvider";
import { Article } from "../../models/Article";

const NavbarUlogovani: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useShoppingCart();

  const handleButtonClick = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    cartItems.forEach((item: Article) => {
      removeFromCart(item.id);
    });

    removeToken();
    console.log("Logout clicked");
  };

  const handleEditData = () => {
    navigate("/dashboard/edit-profile");
  };

  const goToCart = () => {
    navigate("/dashboard/shoppingCart");
  };

  return (
    <nav className={NavbarUlogovaniCSS.navbarU}>
      <div className={NavbarUlogovaniCSS.logoContainer}>
        <img src={logo} alt="Logo" className={NavbarUlogovaniCSS.logo} />
      </div>
      <div className={NavbarUlogovaniCSS.menuButtonsContainer}>
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

        <button
          onClick={goToCart}
          className={NavbarUlogovaniCSS.shoppingCartButton}
        >
          <FaShoppingCart />
        </button>
      </div>

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
};

export default NavbarUlogovani;
