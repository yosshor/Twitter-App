import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import './PostActions.scss';

interface PostActionsProps {
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  likesCount: number;
  commentsCount: number;
}

const PostActions: React.FC<PostActionsProps> = ({ onLike, onComment, onShare, likesCount, commentsCount }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike();
  };

  return (
    <div className="post-actions">
      <button onClick={handleLike} className={liked ? 'liked' : ''}>
        <FontAwesomeIcon icon={faHeart} /> {likesCount}
      </button>
      <button onClick={onComment}>
        <FontAwesomeIcon icon={faComment} /> {commentsCount}
      </button>
      <button onClick={onShare}>
        <FontAwesomeIcon icon={faShare} />
      </button>
    </div>
  );
};

export default PostActions;