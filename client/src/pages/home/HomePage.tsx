import Feed from '../../views/components/feed/Feed';
import './Home.scss';
import useCurrentUser, { useCurrentUserMinData } from '../../hooks/useCurrentUser';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createContext } from "react";
import { PostType } from '../../views/components/post/Post';

export const userTwitterCookie = document.cookie
  .split("; ")
  .find((row) => row.startsWith("userTwitter="))
  ?.split("=")[1];

const devState = {
  mode: 'developer', url: 'http://localhost:3000',
  userTwitterCookie: userTwitterCookie
};
export const productionState = createContext(devState);
export const userToken = createContext({ tokenTwitterUser: userTwitterCookie });

const Home = () => {
  const { userData, loading } = useCurrentUser();
  const { minUserData, isLoading } = useCurrentUserMinData();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userData) return;
        if (!userTwitterCookie) {
          throw new Error("No token found in cookies");
        }

        const response = await fetch(`${devState.url}/api/post/get-all`, { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userTwitterCookie}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }

        const data = await response.json();
        console.log(data);
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchUserPosts();

  }, [userData, devState.url]);


  if (loading || isLoading) return <div>Loading...</div>;
  if (!userData || !minUserData) return <div>No user data available.</div>;



  // Function to add new post
  const addPost = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="home-wrapper">
      <div className="main-feed-content">
        {loading ? (
          <div>Loading user data...</div>
        ) : (
          <>
            {userData ? (
              <>
                {minUserData && <Feed user={minUserData} posts={posts} addPost={addPost} />}
              </>
            ) : (
              <div>No user data found.</div>
            )}
          </>
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default Home;
