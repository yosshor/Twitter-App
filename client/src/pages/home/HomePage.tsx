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
        const response = await fetch('http://localhost:3000/api/post/getPosts')
        const data = await response.json();
        console.log("the data is ",data);
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

      
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <img
                src={post.author.image}
                alt={`${post.author.username}'s profile`}
                className="author-image"
              />
              <span className="author-name">{post.author.username}</span>
            </div>
            <p className="post-content">{post.content}</p>
            {post.imageURL && (
              <img src={post.imageURL} alt="Post visual" className="post-image" />
            )}
            <div className="post-footer">
              <button>Like ({post.likes.length})</button>
              <button>Comments ({post.comments.length})</button>
            </div>
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  );
}

export default Home;
