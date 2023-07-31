import React from "react";
import { Article } from "../../../models/Article";
import CardModuleCSS from "../ArticleCard/Card.module.css";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
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
      <p>Description: {article.description}</p>

      <div className={CardModuleCSS["button-wrapper"]}>
        <button className={`${CardModuleCSS.btn} ${CardModuleCSS.outline}`}>
          DETAILS
        </button>
        <button className={`${CardModuleCSS.btn} ${CardModuleCSS.fill}`}>
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
