import Sidebar from '../../views/components/sidebar/Sidebar';
import Feed from '../../views/components/feed/Feed';
import './Home.scss';
import Header from '../../views/components/header/Header';
import useCurrentUser from '../../hooks/useCurrentUser';
import { Outlet } from 'react-router-dom';
import { useState ,useEffect } from 'react';
import { createContext } from "react";

const devState = { mode: 'developer', url: 'http://localhost:3000' };

export const productionState = createContext(devState);



function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const { userData, loading } = useCurrentUser();

 
  const addPost = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userTwitter="))
          ?.split("=")[1];
          const response = await fetch("http://localhost:3000/api/post/getPosts", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        const data = await response.json();
        if (data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="home-wrapper">
      <div className="main-feed-content">
        {loading ? (
          <div>Loading user data...</div>
        ) : (
          <>
            {userData ? (
              <>
                <Feed posts={posts} addPost={addPost} />
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
