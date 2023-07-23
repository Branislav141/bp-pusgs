import React, { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "../../models/Article";
import { useTokenStore } from "../../store/useTokenStore";
import GetArticlesCSS from "../Article/GetArticles.module.css";
import { useNavigate } from "react-router-dom";

const UserArticles = ({ userEmail }: { userEmail: string }) => {
  const [userArticles, setUserArticles] = useState<Article[] | null>(null);
  const token = useTokenStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      fetchUserArticles();
    }
  }, [userEmail]);

  const fetchUserArticles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/Article/my/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserArticles(response.data);
    } catch (error) {
      console.error("Error fetching user's articles:", error);
    }
  };

  if (!userEmail) {
    return <div>No user email provided.</div>;
  }

  if (userArticles === null) {
    return <div>Loading...</div>;
  }

  const handleEditArticle = (articleId: number) => {
    navigate(`/dashboard/myArticles/editArticle/${articleId}`);
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className={GetArticlesCSS.container}>
      <h2> Articles</h2>
      <table className={GetArticlesCSS.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {userArticles.map((article) => (
            <tr key={article.id}>
              <td>{article.name}</td>
              <td>{article.price}</td>
              <td>{article.quantity}</td>
              <td>{article.description}</td>
              <td>
                <button onClick={() => handleEditArticle(article.id)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button className={GetArticlesCSS["back-button"]} onClick={goBack}>
        Back
      </button>
    </div>
  );
};

export default UserArticles;
