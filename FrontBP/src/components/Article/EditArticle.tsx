import React, { useState, useEffect } from "react";
import axios from "axios";
import { Article } from "../../models/Article";
import { useTokenStore } from "../../store/useTokenStore";
import EditArticleCSS from "./EditArticle.module.css";
import { useNavigate, useParams } from "react-router-dom";

const EditArticle: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();

  const [article, setArticle] = useState<Article | null>(null);
  const token = useTokenStore((state) => state.token);

  const navigate = useNavigate();
  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      const response = await axios.get<Article>(
        `http://localhost:5000/api/Article/${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticle(response.data);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setArticle((prevArticle) => ({
      ...prevArticle!,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/Article/${articleId}`,
        article,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Article updated successfully!");
      navigate("/dashboard/myArticles");
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className={EditArticleCSS.container}>
      <h2>Edit Article</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={article.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={article.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={article.quantity}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={article.description}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditArticle;
