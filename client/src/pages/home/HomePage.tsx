
import { useState } from 'react';
import Sidebar from '../../views/components/sidebar/Sidebar';
import Feed from '../../views/components/feed/Feed';
import './Home.scss';
import Header from '../../views/components/header/Header';
// import { Outlet } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState<any[]>([]);

  // Function to add new post
  const addPost = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  return (
      <div className="home">
        <Header isActive={true} /> {/* Add Header component here */}

        <div className="main-content">
          <Sidebar />
          <Feed posts={posts} addPost={addPost} />
        </div>
      </div>
  );
}

export default Home;
