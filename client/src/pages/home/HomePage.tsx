
import { useEffect, useState } from 'react';
import Sidebar from '../../views/components/sidebar/Sidebar';
import Feed from '../../views/components/feed/Feed';
import './Home.scss';
import Header from '../../views/components/header/Header';
import getCurrentUser from '../../utils/get-current-user/get-current-user';
import type { userDetails } from '../../../../src/models/User';

function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [userData, setUserData] = useState(null);

  // Function to add new post
  const addPost = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  useEffect(() => {
    const fetchUserData = async (): Promise<userDetails> => {
      const user = await getCurrentUser();
      console.log('Fetched user data:', user); // Logs fetched user data
      setUserData(user ?? null); // Use null if no data is returned
      return user;
    };
    fetchUserData();
  }, []);


  return (
    <div className="home">
      <Header isActive={true} />
      <div className="main-content">
        {userData ? (
          <>
            <Sidebar userData={userData} />
            <Feed posts={posts} addPost={addPost} />
          </>
        ) : (
          <div>Loading user data...</div>
        )}
      </div>
    </div>
  );
}

export default Home;
