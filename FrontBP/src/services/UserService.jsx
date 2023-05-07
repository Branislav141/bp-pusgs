import React, { Component } from "react";
import { User } from "../models/User";
import axios from "axios";

class UserService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    fetch("https:/localhost:3001/api/Users/all")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          users: data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          users: [],
          loading: false,
          error: "Failed to fetch users",
        });
      });
  }

  render() {
    const { users, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div>
        <h1>User List</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default UserService;
