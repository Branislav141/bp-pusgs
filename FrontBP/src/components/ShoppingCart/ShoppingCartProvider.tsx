import React, { createContext, useContext, useEffect, useState } from "react";
import { Article } from "../../models/Article";

interface ShoppingCartContextValue {
  cartItems: Article[];
  addToCart: (article: Article) => void;
  removeFromCart: (itemId: number) => void;
  isArticleInCart: (article: Article) => boolean;
}

const ShoppingCartContext = createContext<ShoppingCartContextValue | undefined>(
  undefined
);

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider"
    );
  }
  return context;
};

const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<Article[]>(() => {
    const cartItemsFromStorage = localStorage.getItem("cartItems");
    return cartItemsFromStorage ? JSON.parse(cartItemsFromStorage) : [];
  });
  const [addedArticles, setAddedArticles] = useState<string[]>(() => {
    const addedArticlesFromStorage = localStorage.getItem("addedArticles");
    return addedArticlesFromStorage ? JSON.parse(addedArticlesFromStorage) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("addedArticles", JSON.stringify(addedArticles));
  }, [addedArticles]);

  const addToCart = (article: Article) => {
    if (!addedArticles.includes(article.id.toString())) {
      setCartItems((prevCartItems) => [...prevCartItems, article]);
      setAddedArticles((prevAddedArticles) => [
        ...prevAddedArticles,
        article.id.toString(),
      ]);
    }
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== itemId)
    );
    setAddedArticles((prevAddedArticles) =>
      prevAddedArticles.filter((id) => id !== itemId.toString())
    );
  };

  const isArticleInCart = (article: Article) => {
    return addedArticles.includes(article.id.toString());
  };

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, isArticleInCart }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;
