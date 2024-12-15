import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import './PostActions.scss';
import { productionState } from "../../../pages/home/HomePage";

interface PostActionsProps {
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    likesCount: number;
    commentsCount: number;
    id: string,
}

const PostActions: React.FC<PostActionsProps> = ({ onLike, onComment, onShare, likesCount, commentsCount, id }) => {
    const [liked, setLiked] = useState(false);
    const state = useContext(productionState);
    
    async function likePost(postId: string) {
        try {
            const userTwitterCookie = state.userTwitterCookie;
            if (!userTwitterCookie) {
                throw new Error("No token found in cookies");
            }
            const url = `${state.url}/api/post/${postId}/like`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userTwitterCookie}`,
                },
            });
            if (response.ok) {
                console.log("Post liked successfully");
                // Navigate("/home");
            } else {
                console.error("Error liking recipe");
            }
        } catch (error) {
            console.error("Error liking recipe:", error);
        }
    }

    const handleLike = (postId: string) => {
        console.log('postId:', postId);
        setLiked(!liked);
        likePost(postId);
        // likeButton.textContent = `Like (${recipe.likes.length})`;
        // likeButton.onclick = () => likeRecipe(recipe._id);
        // recipeCard.appendChild(likeButton);
        onLike();
    };

    return (
        <div className="post-actions">
            <button onClick={() => handleLike(id)} className={liked ? 'liked' : ''}>
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