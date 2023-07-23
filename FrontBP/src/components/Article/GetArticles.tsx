import React, { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "../../models/Article";
import { useTokenStore } from "../../store/useTokenStore";

const UserArticles = ({ userEmail }: { userEmail: string }) => {
  const [userArticles, setUserArticles] = useState<Article[] | null>(null);
  const token = useTokenStore((state) => state.token);

  useEffect(() => {
    fetchUserArticles();
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

  if (userArticles === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User's Articles</h2>
      <ul>
        {userArticles ? (
          userArticles.map((article) => (
            <li key={article.id}>
              <h3>{article.name}</h3>
              <p>Price: {article.price}</p>
              <p>Quantity: {article.quantity}</p>
              <p>Description: {article.description}</p>
            </li>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </ul>
    </div>
  );
};

export default UserArticles;
