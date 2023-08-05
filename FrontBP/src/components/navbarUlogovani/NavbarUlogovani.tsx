import React, { useEffect, useState } from "react";
import NavbarUlogovaniCSS from "./NavbarUlogovani.module.css";
import menuIcon from "../../photos/slikaAcc.png";
import { removeToken } from "../../store/useTokenStore";
import { useNavigate } from "react-router-dom";
import logo from "../../photos/bplogo.jpg";
import { FaShoppingCart } from "react-icons/fa";

import { Article } from "../../models/Article";
import { useShoppingCart } from "../ShoppingCart/Cart/ShoppingCartProvider";
import { useTokenStore } from "../../store/useTokenStore";

const NavbarUlogovani: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useShoppingCart();

  const token = useTokenStore((state) => state.token);
  const userAccountType = useTokenStore((state) => state.accountType);

  useEffect(() => {
    setIsBuyer(userAccountType === "kupac");
  }, [userAccountType]);

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

        {isBuyer && (
          <button
            onClick={goToCart}
            className={NavbarUlogovaniCSS.shoppingCartButton}
          >
            <FaShoppingCart />
          </button>
        )}
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
