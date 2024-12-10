import Sidebar from '../../views/components/sidebar/Sidebar';
import Feed from '../../views/components/feed/Feed';
import './Home.scss';
import Header from '../../views/components/header/Header';
import useCurrentUser from '../../hooks/useCurrentUser';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { createContext } from "react";

const devState = { mode: 'developer', url: 'http://localhost:3000' };

export const productionState = createContext(devState);



function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const { userData, loading } = useCurrentUser();

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
