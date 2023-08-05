import React, { useEffect, useState } from "react";
import axios from "axios";

import NewBuyerOrdersCSS from "./NewOrdersBuyer.module.css";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../../models/Order";
import { useTokenStore } from "../../../../store/useTokenStore";
import { toast } from "react-toastify";

const BuyerOrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>(
        "http://localhost:5000/api/Order/GetNewOrdersByBuyer",
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

  const cancelOrder = async (orderId: number) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/Order/CancelOrder/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();

      toast.success("Order canceled successfully!");
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Error canceling order. Please try again.");
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <div>
        <h1 className={NewBuyerOrdersCSS["naslov"]}>Order List</h1>
        <div className={NewBuyerOrdersCSS.container}>
          {orders.map((order) => (
            <div
              key={order.id}
              className={NewBuyerOrdersCSS["order-container"]}
            >
              <h2>Order ID: {order.id}</h2>
              <p>Total Price: ${order.totalPrice}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <p>Delivery Date: {order.deliveryDate}</p>

              <div className={NewBuyerOrdersCSS["article-container"]}>
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

                    <tr>
                      <td>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className={NewBuyerOrdersCSS["cancel-button"]}
                        >
                          Cancel Order
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={goBack} className={NewBuyerOrdersCSS["back-button"]}>
        Back
      </button>
    </div>
  );
};

export default BuyerOrdersTable;
