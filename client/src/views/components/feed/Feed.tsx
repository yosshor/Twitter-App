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
  // const handleAddPost = (newPost: any) => {
  //   console.log("newPost:", newPost);
  //   setPostList([newPost, ...postList]);
  // };
  // Function to delete post
  const deletePost = (id: string) => {
    console.log('Deleting post:', id);
    const post = posts.findIndex((post) => post._id === id);
    if (post === -1) {
      console.error("Post not found");
      return;
    }
    console.log('Post found:', post);
    posts.splice(post, 1);
    setPostList([...posts]);
  }
  const handleDeletePost = (id: string) => {
    console.log('Deleting post:', id);
    setPostList((prevList) => prevList.filter((post) => post._id !== id));
  };

  useEffect(() => {
    setPostList(posts);
  }, [posts]);
  console.log(handleDeletePost);
  return (
    <div className="feed">
      <PostForm addPost={addPost} />
      <div className="feed__posts">
        {postList.map((post, index) => (
          <Post userId={user.userId}
            key={index}
            postData={post}
            onDelete={handleDeletePost} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
