import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ArticleCard from "../ArticleCard/ArticleCard";
import { useTokenStore } from "../../../store/useTokenStore";
import { Article } from "../../../models/Article";
import AllAriclesCss from "./AllArticles.module.css";
import { useNavigate } from "react-router-dom";

const AllArticles: React.FC = () => {
  const token = useTokenStore((state) => state.token);
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  const fetchArticles = useCallback(async () => {
    try {
      const response = await axios.get<Article[]>(
        "http://localhost:5000/api/Article",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className={AllAriclesCss.container}>
      <h1>All Articles</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className={AllAriclesCss["back-button-container"]}>
        <button onClick={goBack} className={AllAriclesCss["back-button"]}>
          Back
        </button>
      </div>
    </div>
  );
};

export default AllArticles;
