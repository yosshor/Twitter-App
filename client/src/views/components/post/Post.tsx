import { FC, useContext, useEffect, useState } from 'react';
import './Post.scss';
import { productionState } from "../../../pages/home/HomePage";
import { formatDistanceToNow } from 'date-fns';
import PostActions from '../postActions/PostActions';


export interface PostType {
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  likes: string[];
  userId: {
    fullName: string;
    email: string;
    createdAd: Date;
    profileImage: string;
    _id: string;
  };
}


const Post: FC<PostType> = (postData) => {
  const state = useContext(productionState);
  const [likesCount, setLikesCount] = useState(postData.likes.length);
  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const checkIfUserLikeThisPost = async (postDataLikes: any) => {
    if (postDataLikes.length > 0) {
      const userLiked = await postData.likes.findIndex((like: any) => like.userId === postData.userId._id);
      if (userLiked > -1) {
        setLiked(true);
      }
    }
  }

  const handleShowUserProfile = async (userId: string) => {
    try {

      const response = await fetch(`${state.url}/api/post/get-user-details/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ 'userId': userId }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('data:', data);
        return data;
      } else {
        console.error("Error getting user data");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }
  const handleShowPost = async (e: any) => {
    const postId = e.target.id;
    console.log('postId:', postId);
    try {
      const response = await fetch(`${state.url}/api/post/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('data:', data);
        return data;
      } else {
        console.error("Error getting post data");
      }
    } catch (error) {
      console.error("Error getting post data:", error);
    }
  }

  
  const handleLike = () => {
    setLikesCount(likesCount + 1);
  };

  const handleComment = () => {
    // Add logic to open comment section or redirect to comment page
  };

  const handleShare = () => {
    // Add logic to share the post
  };

  if (postData.userId) {
    checkIfUserLikeThisPost(postData.likes);

    const userHandle = postData.userId.fullName
      .split(" ")
      .map((part) => part.toLowerCase().trim())
      .join("") || "";
    let imageUrl = postData.image;
    let profileImage = 'https://i1.sndcdn.com/artworks-000189080723-ez2uad-t500x500.jpg';
    if (imageUrl) {
      imageUrl = imageUrl.includes('uploads\\posts') ? `${state.url.length > 0 ? state.url : '../../../../../'}/` + postData.image : postData.image;
    }
    if (postData.userId.profileImage) {
      profileImage = postData.userId.profileImage.includes('uploads\\users') ? `${state.url.length > 0 ? state.url : '../../../../../'}/`
        + postData.userId.profileImage : postData.userId.profileImage;
    }
    return (
      <div className="post">
        <div onClick={() => handleShowUserProfile(postData.userId._id)} className='post-user-header' id={postData.userId._id} >
          {profileImage && <img src={profileImage} alt="Post" className="user-image" />}
          <h3>{postData.userId.fullName && ''} @{userHandle}</h3>
          <p>{formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}</p>
        </div>
        <div  onClick={handleShowPost}  className="post-details" id={postData._id}>
          <p>{postData.content}</p>
          {postData.image && <img src={imageUrl} alt="Post" className="post__image" />}
        </div>
        <PostActions
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          likesCount={likesCount}
          commentsCount={commentsCount}
          id={postData._id}
          userLiked={liked}

        />
      </div>
    );
  }
  else {
    console.log('postData:', postData);
    return <div>No user data available.</div>;

  }
}

export default Post;
