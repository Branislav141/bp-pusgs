import React, { useState } from "react";
import { Article } from "../../../models/Article";
import CardModuleCSS from "../ArticleCard/Card.module.css";
import { useShoppingCart } from "../../ShoppingCart/Cart/ShoppingCartProvider";
import Modal from "./CardModal";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { addToCart } = useShoppingCart();

  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className={CardModuleCSS["article-card"]}>
      <div>
        {article.aPhoto?.url ? (
          <img src={article.aPhoto.url} alt={article.name} />
        ) : (
          <p>No photo available</p>
        )}
      </div>
      <h1>{article.name}</h1>
      <p>Price: {article.price}</p>
      <p>Quantity: {article.quantity}</p>

      <div className={CardModuleCSS["button-wrapper"]}>
        <button
          className={`${CardModuleCSS.btn} ${CardModuleCSS.outline}`}
          onClick={openModal} // Open the modal when clicked
        >
          DETAILS
        </button>
        <button
          className={`${CardModuleCSS.btn} ${CardModuleCSS.fill}`}
          onClick={() => addToCart(article)}
        >
          BUY NOW
        </button>
      </div>
      {modalVisible && (
        <Modal closeModal={closeModal}>
          <p>{article.description}</p>
        </Modal>
      )}
    </div>
  );
};

export default ArticleCard;
