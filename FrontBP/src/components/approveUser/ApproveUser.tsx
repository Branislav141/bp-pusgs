import React, { useState } from "react";
import axios from "axios";
import { useTokenStore } from "../../store/useTokenStore";

interface ApproveDeclineModel {
  email: string;
}

const ApproveUser: React.FC = () => {
  const token = useTokenStore((state) => state.token);
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api",
        { email } as ApproveDeclineModel,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User approved successfully");
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Approve User</button>
    </form>
  );
};

export default ApproveUser;
