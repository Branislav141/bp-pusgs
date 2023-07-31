import React from "react";

interface CartItemProps {
  name: string;
  price: number;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ name, price, quantity }) => {
  return (
    <div>
      <p>{name}</p>
      <p>Price: {price}</p>
      <p>Quantity: {quantity}</p>
      <p>Total: {price * quantity}</p>
    </div>
  );
};

export default CartItem;
