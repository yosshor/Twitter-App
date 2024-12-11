import Post from '../post/Post';
import PostForm from '../postForm/PostForm';
import './Feed.scss';
import { FC } from 'react';


interface FeedProps {
  posts: any[];
  addPost: (newPost: any) => void;
}


const Feed: FC<FeedProps> = ({ posts, addPost }) => {
  return (
    <div className="feed">
      <PostForm addPost={addPost} />
      <div className="feed__posts">
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
