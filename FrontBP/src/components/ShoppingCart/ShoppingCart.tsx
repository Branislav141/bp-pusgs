import React, { useState } from "react";
import { useShoppingCart } from "./ShoppingCartProvider";
import { Article } from "../../models/Article";
import ShopingCartCSS from "../ShoppingCart/ShoppingCart.module.css";
import QuantityModal from "./QuantityModal";

const ShoppingCart: React.FC = () => {
  const { cartItems, removeFromCart } = useShoppingCart();
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [itemId: number]: number;
  }>({});

  const [quantities, setQuantities] = useState<{ [itemId: number]: number }>(
    {}
  );

  const printQuantitiesInConsole = () => {
    const newSelectedQuantities: { [itemId: number]: number } = {};
    cartItems.forEach((item) => {
      const itemId = item.id;
      const quantity = quantities[itemId] || 1;

      newSelectedQuantities[itemId] = quantity;
    });

    setSelectedQuantities(newSelectedQuantities);
  };
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    const clampedQuantity = Math.min(
      Math.max(newQuantity, 1),
      cartItems.find((item) => item.id === itemId)?.quantity || 1
    );
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: clampedQuantity,
    }));
  };

  const handleRemoveFromCart = (itemId: number) => {
    removeFromCart(itemId);
  };

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleBuyClick = () => {
    setIsModalVisible(true);
    setSelectedArticle(cartItems[0]);
  };

  const handleConfirmPurchase = (
    article: Article,

    deliveryAddress: string
  ) => {
    setIsModalVisible(false);
  };

  const total = cartItems.reduce((total, item) => {
    const quantity = quantities[item.id] || 1;
    return total + item.price * quantity;
  }, 0);

  return (
    <div className={ShopingCartCSS["shopping-cart"]}>
      <h1>Shopping Cart</h1>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Picture</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const itemId = item.id;
            const totalPrice = (quantities[itemId] || 1) * item.price;
            return (
              <tr key={itemId}>
                <td>{item.name}</td>
                <td>
                  {item.aPhoto?.url ? (
                    <img
                      className={ShopingCartCSS.articleImg}
                      src={item.aPhoto.url}
                      alt={item.name}
                    />
                  ) : (
                    <p>No photo available</p>
                  )}
                </td>
                <td>{item.price}</td>
                <td>
                  Quantity:
                  <input
                    type="number"
                    value={quantities[itemId] || 1}
                    onChange={(event) =>
                      handleQuantityChange(itemId, Number(event.target.value))
                    }
                    min={1}
                    max={item.quantity}
                  />
                  <span>/ Max: {item.quantity}</span>{" "}
                </td>
                <td>${totalPrice}</td>
                <td>
                  <button
                    className={ShopingCartCSS.removebutton}
                    onClick={() => handleRemoveFromCart(itemId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className={ShopingCartCSS.buyButton}
        onClick={() => {
          handleBuyClick();
          printQuantitiesInConsole();
        }}
      >
        Buy
      </button>
      {isModalVisible && selectedArticle && (
        <QuantityModal
          cartItems={cartItems}
          article={selectedArticle}
          total={total}
          onClose={() => setIsModalVisible(false)}
          onConfirm={(total, deliveryAddress) =>
            handleConfirmPurchase(selectedArticle, deliveryAddress)
          }
          quantities={selectedQuantities}
          removeFromCart={handleRemoveFromCart}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
