import React from "react";

type PostCardProps = {
  post: {
    _id: string;
    content: string;
    imageURL: string;
    author: {
      _id: string;
      username: string;
      image: string;
    };
    likes: string[];
    comments: any[];
  };
  handleProfile: (userId: string) => void;
};

const PostCard: React.FC<PostCardProps> = ({ post, handleProfile }) => {
  return (
    <div className="post-card">
      <div
        className="post-header"
        style={{ cursor: "pointer" }}
        onClick={() => handleProfile(post.author._id)}
      >
        <img
          src={post.author.image}
          alt={`${post.author.username}'s profile`}
          className="author-image"
        />
        <span className="author-name">{post.author.username}</span>
      </div>
      <p className="post-content">{post.content}</p>
      {post.imageURL && <img src={post.imageURL} alt="Post image" className="post-image" />}
      <div className="post-footer">
        <button onClick={() => console.log(`Liked post ${post._id}`)}>Like ({post.likes.length})</button>
        <button onClick={() => console.log(`Show comments for ${post._id}`)}>
          Comments ({post.comments.length})
        </button>
      </div>
    </div>
  );
};

export default PostCard;
