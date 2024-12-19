import Post from '../post/Post';
import PostForm from '../postForm/PostForm';
import './Feed.scss';
import { FC, useEffect, useState } from 'react';


interface FeedProps {
  posts: any[];
  user: {
    userId: string;
    userData: { email: string; name: string; role: string; userId: string };
  };
  addPost: (newPost: any) => void;
}


const Feed: FC<FeedProps> = ({ user, posts, addPost }) => {
  const [postList, setPostList] = useState(posts);
  const handleAddPost = (newPost: any) => {
    console.log("newPost:", newPost);
    setPostList([newPost, ...postList]);
  };

  useEffect(() => {
    setPostList(posts);
  }, [posts]);
  return (
    <div className="feed">
      <PostForm addPost={handleAddPost} />
      <div className="feed__posts">
        {postList.map((post, index) => (
          <Post userId={user.userId} key={index} postData={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
