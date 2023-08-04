import React, { useState } from "react";
import QuantityModalCSS from "../ShoppingCart/QuantityModal.module.css";
import axios from "axios";
import { useTokenStore } from "../../store/useTokenStore";
import { Article } from "../../models/Article";
import { useNavigate } from "react-router-dom";

interface QuantityModalProps {
  total: number;
  cartItems: Article[];
  article: Article;
  onClose: () => void;
  onConfirm: (total: number, deliveryAddress: string) => void;
  quantities: { [itemId: number]: number };
  removeFromCart: (itemId: number) => void;
}

const QuantityModal: React.FC<QuantityModalProps> = ({
  total,
  article,
  cartItems,
  onClose,
  onConfirm,
  quantities,
  removeFromCart,
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [isAddressEmpty, setIsAddressEmpty] = useState<boolean>(false);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (deliveryAddress.trim() === "") {
      setIsAddressEmpty(true);
      return;
    }

    console.log(quantities);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Order",
        {
          Quantities: quantities,
          cartItems,
          DeliveryAddress: deliveryAddress,
          TotalPrice: total,
          Comment: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("New order created:", response.data);
      onConfirm(total, deliveryAddress);

      cartItems.forEach((item) => {
        removeFromCart(item.id);
      });
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("Error creating the order:", error);
    }
  };

  const handleDeliveryAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryAddress(event.target.value);
    setIsAddressEmpty(false);
  };
  const totalwithdelivery = total + 5;
  return (
    <div className={QuantityModalCSS["modal-container"]}>
      <div className={QuantityModalCSS["modal-content"]}>
        <div className={QuantityModalCSS["total-container"]}>
          Total Price with delivery: ${totalwithdelivery}
        </div>

        <div className={QuantityModalCSS["input-container"]}>
          <input
            type="text"
            value={deliveryAddress}
            onChange={handleDeliveryAddressChange}
            placeholder="Delivery Address"
            className={`${QuantityModalCSS["delivery-address-input"]} ${
              isAddressEmpty ? QuantityModalCSS["empty-address"] : ""
            }`}
          />
        </div>
        <div className={QuantityModalCSS["button-container"]}>
          <button
            onClick={handleConfirm}
            className={`${QuantityModalCSS["modal-button"]} ${QuantityModalCSS["confirm-button"]}`}
          >
            Buy
          </button>
          <button
            onClick={onClose}
            className={`${QuantityModalCSS["modal-button"]} ${QuantityModalCSS["cancel-button"]}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
