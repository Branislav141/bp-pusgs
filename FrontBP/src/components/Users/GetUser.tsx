import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../models/User";

interface GetUserProps {
  userId: string; // Explicitly define the type of the `id` prop as string
}

const GetUser = ({ userId }: GetUserProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/Users/user/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        // Handle any errors from the API
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      <h1>User Details</h1>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Surname: {user.surname}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GetUser;
