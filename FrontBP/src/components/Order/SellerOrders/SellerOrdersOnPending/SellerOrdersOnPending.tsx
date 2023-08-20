import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SellerOrdersCSS from "./SellerOrdersOnPending.module.css";
import { useNavigate } from "react-router-dom";
import {
  setmapaCoordinates,
  useTokenStore,
} from "../../../../store/useTokenStore";
import { Order } from "../../../../models/Order";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const SellerOrdersStatusPending: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();
  const koordinate = useTokenStore((state) => state.mapaCoordinates);
  const customIcon = L.icon({
    iconUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("userEmail") || "";
  });

  const [mapCoordinates, setMapCoordinates] = useState<[number, number] | null>(
    null
  );
  const [mapAddress, setMapAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>(
        "http://localhost:5000/api/Order/GetOrdersByUserCreatedAndStatusPending",
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
      formattedOrders.forEach((order) => {
        if (order.deliveryAddress) {
          handleGeocodeAddress(order.deliveryAddress);
        }
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSetProcessingStatus = async (orderId: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/Order/UpdateOrderStatus/${orderId}`,
        { status: "Processing" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (error) {
      console.error("Error setting status:", error);
    }
  };

  const handleGeocodeAddress = async (address: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );

      if (response.data.length > 0) {
        const lat = parseFloat(response.data[0].lat);
        const lon = parseFloat(response.data[0].lon);

        setmapaCoordinates([lat, lon]);
        setMapCoordinates([lat, lon]);
        setMapAddress(address);
      } else {
        console.log("No matching locations found.");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      setMapCoordinates(null);
      setMapAddress(null);
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
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
            <br />
            <p>STATUS: {order.ordersStatus}</p>

            <div className={SellerOrdersCSS["article-container"]}>
              <h3>Articles:</h3>
              <table>
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
                            <img src={article.aPhoto.url} alt={article.name} />
                          ) : (
                            <p>No photo available</p>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <br />
              <button onClick={() => handleSetProcessingStatus(order.id)}>
                Set Processing
              </button>
            </div>

            {mapCoordinates && mapAddress === order.deliveryAddress && (
              <MapContainer
                center={mapCoordinates}
                zoom={13}
                style={{ width: "100%", height: "300px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapCoordinates && (
                  <Marker position={mapCoordinates} icon={customIcon}>
                    <Popup>{order.deliveryAddress}</Popup>
                  </Marker>
                )}
              </MapContainer>
            )}
          </div>
        ))}
      </div>
      <button onClick={goBack} className={SellerOrdersCSS["back-button"]}>
        Back
      </button>
    </div>
  );
};

export default SellerOrdersStatusPending;
