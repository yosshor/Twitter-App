import React, { useContext, useState, useEffect } from 'react';
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
    id: string;
    userLiked: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({ onLike, onComment, onShare, likesCount, commentsCount, id, userLiked }) => {
    const state = useContext(productionState);
    const [liked, setLiked] = useState(userLiked);
    const [likes, setLikesCount] = useState(likesCount);

    useEffect(() => {
        setLiked(userLiked);
    }, [userLiked]);

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
                const data = await response.json();
                if (data.message === "Like removed") {
                    setLikesCount(likes > 0 ? likes - 1 : 0);
                    setLiked(false);
                    console.log("Post unliked successfully");
                } else {
                    setLikesCount(likes + 1);
                    setLiked(true);
                    console.log("Post liked successfully");
                }
            } else {
                console.error("Error liking post");
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    }

    const handleLike = (postId: string) => {
        likePost(postId);
        onLike();
    };

    return (
        <div className="post-actions">
            <button onClick={() => handleLike(id)} className={liked ? 'liked' : ''}>
                <FontAwesomeIcon icon={faHeart} /> {likes}
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