import React, { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "../../models/Order";
import { useTokenStore } from "../../store/useTokenStore";
import AllOrdersCSS from "./AllOrders.module.css";
import { useNavigate } from "react-router-dom";

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>(
        "http://localhost:5000/api/Order/GetAllOrders",
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

  return (
    <div>
      <h1 className={AllOrdersCSS["naslov"]}>Order List</h1>
      <div className={AllOrdersCSS.container}>
        {orders.map((order) => (
          <div key={order.id} className={AllOrdersCSS["order-container"]}>
            <h2>Order ID: {order.id}</h2>
            <p>Total Price: {order.totalPrice}</p>
            <p>Delivery Address: {order.deliveryAddress}</p>
            <p>Delivery Date: {order.deliveryDate}</p>
            <p>Order Date: {order.orderDate}</p>
            <p>Comment: {order.comment}</p>
            <div className={AllOrdersCSS["article-container"]}>
              <h3>Articles:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Photo</th>
                  </tr>
                </thead>
                <tbody>
                  {order.articles.map((article) => (
                    <tr key={article.id}>
                      <td>{article.name}</td>
                      <td>{article.price}</td>
                      <td>{article.quantity}</td>
                      <td>
                        {article.aPhoto ? (
                          <img src={article.aPhoto.url} alt={article.name} />
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
  );
};

export default OrdersTable;
