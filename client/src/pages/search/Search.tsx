import React, { useState, useEffect } from "react";
import "./Search.scss";
import UserCard from "../../views/components/user/UserCard";
import { useLocation } from "react-router-dom";

const Search: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>(location.state?.searchQuery || "");

  useEffect(() => {
    console.log("Search term:", searchTerm);
    console.log("Location state:", location.state);
    if (searchTerm) {
      handleSearchQuery(searchTerm);
    }
  }, [searchTerm]);

  const handleSearchQuery = async (name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/users/find-users-by-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
      document.cookie = "search=; Max-Age=0; path=/";
    }
  };

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userTwitter="))
        ?.split("=")[1];

      const response = await fetch("http://localhost:3000/api/users/follow-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log(isFollowing ? `Unfollowed user with ID: ${userId}` : `Followed user with ID: ${userId}`);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isFollowing: !isFollowing } : user
          )
        );
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div className="search-page">
      <div className="user-list">
        {users.length === 0 && !isLoading && <p>No users found</p>}
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onFollow={() => handleFollow(user._id, user.isFollowing)}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;