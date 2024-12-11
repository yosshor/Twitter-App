import { useState, useEffect } from "react";
import Post from "../../views/components/post/Post";
import useCurrentUser from "../../hooks/useCurrentUser";
import styles from "./UserProfile.module.scss";

type PostType = {
  content: string;
  image?: string;
};

const UserProfile = () => {
  const { userData, loading } = useCurrentUser();
  const [posts, setPosts] = useState<PostType[]>([]); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userData) return;

        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userTwitter="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("No token found in cookies");
        }
       
        const response = await fetch("http://localhost:3000/api/post/get-user-posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: userData.id }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }

        const data = await response.json();
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    };

    fetchUserPosts();
  }, [userData]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.main}>
      {userData ? (
        <div>
          <h1>Welcome, {userData.fullName}!</h1>
          <p>Email: {userData.email}</p>
          <div className={styles["posts-container"]}>
            {error ? (
              <p>{error}</p>
            ) : posts.length === 0 ? (
              <p>No posts found for this user.</p>
            ) : (
              posts.map((post, index) => (
                <div className={styles["post-card"]}>
                <Post key={index} content={post.content} image={post.image} />
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div>No user data available.</div>
      )}
    </div>
  );
};

export default UserProfile;
