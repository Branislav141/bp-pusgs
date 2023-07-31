import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../ArticleCard/ArticleCard";
import { useTokenStore } from "../../../store/useTokenStore";
import { Article } from "../../../models/Article";
import AllAriclesCss from "../AllArticles/AllArticles.module.css";
import { useNavigate } from "react-router-dom";

const AllArticles: React.FC = () => {
  const token = useTokenStore((state) => state.token);
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
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
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className={AllAriclesCss.container}>
      <h1>All Articles</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <button onClick={goBack} className={AllAriclesCss["back-button"]}>
        Back
      </button>
    </div>
  );
};

export default AllArticles;
