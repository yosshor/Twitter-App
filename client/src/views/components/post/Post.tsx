import { FC } from 'react';
import './Post.scss';

interface PostProps {
    content: string;
    image?: string;
    }


const Post: FC<PostProps> = ({ content, image }) => {
  return (
    <div className="post">
      <p>{content}</p>
      {image && <img src={image} alt="Post" className="post__image" />}
    </div>
  );
}

export default Post;
