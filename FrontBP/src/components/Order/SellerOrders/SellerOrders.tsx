import React, { useEffect, useState } from "react";
import axios from "axios";

import SellerOrdersCSS from "./SellerOrders.module.css";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../models/Order";
import { useTokenStore } from "../../../store/useTokenStore";

const SellerOrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("userEmail") || "";
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>(
        "http://localhost:5000/api/Order/GetOrdersByUserCreated",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedOrders = response.data.map((order) => ({
        ...order,
        deliveryDate: order.deliveryDate
          ? new Date(order.deliveryDate).toLocaleString()
          : "Not specified",
        orderDate: order.orderDate
          ? new Date(order.orderDate).toLocaleString()
          : "Not specified",
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <div>
        <h1 className={SellerOrdersCSS["naslov"]}>Order List</h1>
        <div className={SellerOrdersCSS.container}>
          {orders.map((order) => (
            <div key={order.id} className={SellerOrdersCSS["order-container"]}>
              <h2>Order ID: {order.id}</h2>
              <p>
                Total price:${" "}
                {order.articles
                  .filter((article) => article.userCreated === userEmail)
                  .reduce(
                    (acc, article) => acc + article.price * article.quantity,
                    0
                  )}
              </p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <p>Delivery Date: {order.deliveryDate}</p>

              <div className={SellerOrdersCSS["article-container"]}>
                <h3>Articles:</h3>
                <table>
                  {/* Table header here */}
                  <tbody>
                    {order.articles
                      .filter((article) => article.userCreated === userEmail)
                      .map((article) => (
                        <tr key={article.id}>
                          <td>{article.name}</td>
                          <td>{article.price}</td>
                          <td>{article.quantity}</td>
                          <td>
                            {article.aPhoto ? (
                              <img
                                src={article.aPhoto.url}
                                alt={article.name}
                              />
                            ) : (
                              <p>No photo available</p>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={goBack} className={SellerOrdersCSS["back-button"]}>
        Back
      </button>
    </div>
  );
};

export default SellerOrdersTable;
