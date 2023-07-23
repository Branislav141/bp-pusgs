import React, { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "../../models/Article";
import { useTokenStore } from "../../store/useTokenStore";
import GetArticlesCSS from "../Article/GetArticles.module.css";

const UserArticles = ({ userEmail }: { userEmail: string }) => {
  const [userArticles, setUserArticles] = useState<Article[] | null>(null);
  const token = useTokenStore((state) => state.token);

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

  return (
    <div className={GetArticlesCSS.container}>
      <h2>User's Articles</h2>
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
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserArticles;
