import React, { useContext, useState } from 'react';
import { productionState, userToken } from '../../../pages/home/HomePage';

interface CommentProps {
  postId: string;
  addComment: (newComment: any) => void;
}

const Comment: React.FC<CommentProps> = ({ postId, addComment }) => {
  const [comment, setComment] = useState('');
  const state = useContext(productionState);
  const token = useContext(userToken);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      console.log('Submitting comment:', token);
      const response = await fetch(`${state.url}/api/post/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token.tokenTwitterUser}`
        },
        body: JSON.stringify({ text: comment }),
      });

      if (response.ok) {
        const newComment = await response.json();
        console.log('Comment submitted successfully', newComment);
        setComment('');
        addComment(newComment); // Call the addComment callback with the new comment
      } else {
        console.error('Error submitting comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className='comment-wrapper'>
      <input
        type='text'
        placeholder='Insert your comment'
        value={comment}
        onChange={handleCommentChange}
      />
      <button onClick={handleCommentSubmit}>Submit</button>
    </div>
  );
};

export default Comment;