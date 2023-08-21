import React, { useEffect, useState } from "react";
import QuantityModalCSS from "../Modal/QuantityModal.module.css";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { Article } from "../../../models/Article";
import { useTokenStore } from "../../../store/useTokenStore";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface QuantityModalProps {
  total: number;
  cartItems: Article[];
  article: Article;
  onClose: () => void;
  onConfirm: (total: number, deliveryAddress: string, comment: string) => void;
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
  const [comment, setComment] = useState<string>("");
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isAddressEntered, setIsAddressEntered] = useState(false);

  const handleConfirm = async () => {
    if (deliveryAddress.trim() === "") {
      setIsAddressEmpty(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Order",
        {
          Quantities: quantities,
          cartItems,
          DeliveryAddress: deliveryAddress,
          TotalPrice: total,
          Comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("New order created:", response.data);
      onConfirm(total, deliveryAddress, comment);

      cartItems.forEach((item) => {
        removeFromCart(item.id);
      });
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("Error creating the order:", error);
    }
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleDeliveryAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAddress = event.target.value;
    setDeliveryAddress(newAddress);
    setIsAddressEntered(newAddress.trim() !== "");
    setIsAddressEmpty(false);
  };

  const totalwithdelivery = total + 5;

  async function createOrder(data: any, actions: any): Promise<string> {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/PayPal/CreateOrderByPayPal",
        {
          Quantities: quantities,
          cartItems,
          DeliveryAddress: deliveryAddress,
          TotalPrice: total,
          Comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orderId = response.data.orderId;
      console.log(orderId);
      setOrderId(orderId);
      return response.data.orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async function onApprove(data: any, actions: any): Promise<void> {
    try {
      await axios.post(
        "http://localhost:5000/api/PayPal/ApproveOrderByPayPal",
        {
          orderId: data.orderID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      cartItems.forEach((item) => {
        removeFromCart(item.id);
      });
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("Error approving PayPal payment:", error);
    }
  }

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
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Your Comment"
            className={QuantityModalCSS["comment-textarea"]}
          />
        </div>
        <div>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            disabled={!isAddressEntered}
          />
        </div>
        <div className={QuantityModalCSS["button-container"]}>
          <button
            onClick={handleConfirm}
            className={`${QuantityModalCSS["modal-button"]} ${QuantityModalCSS["confirm-button"]}`}
          >
            BUY(CASH ON DELIVERY)
          </button>
          <button
            onClick={onClose}
            className={`${QuantityModalCSS["modal-button"]} ${QuantityModalCSS["cancel-button"]}`}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
export default QuantityModal;
