import Post from '../post/Post';
import PostForm from '../postForm/PostForm';
import './Feed.scss';
import { FC, useEffect, useState } from 'react';


interface FeedProps {
  posts: any[];
  addPost: (newPost: any) => void;
}


const Feed: FC<FeedProps> = ({ posts, addPost }) => {
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
          <Post key={index} postData={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
