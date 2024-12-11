import { FC } from 'react';
import './Post.scss';

// interface PostProps {
//     content: string;
//     image?: string;
//     fullName: string;
//     email: string;
//     createdAt: string;
//     }
interface PostType {
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  userId: {
    fullName: string;
    email: string;
    createdAd: Date;
    _id: string;
  };
}

const Post: FC<PostType> = (postData) => {
  if (!postData.userId) return <div>No user data available.</div>;
  console.log('postData:', postData);
  const userHandle = postData.userId.fullName
    .split(" ")
    .map((part) => part.toLowerCase().trim())
    .join("") || "";
  return (
    <div className="post">
      <h3>{postData.userId.fullName && ''} @{userHandle}</h3>
      <p>{postData.content}</p>
      {postData.image && <img src={postData.image} alt="Post" className="post__image" />}
    </div>
  );
}

export default Post;
