import { FC, useContext, useState } from 'react';
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
  const [likesCount, setLikesCount] = useState(0); //postData.likesCount ||
  const [commentsCount, setCommentsCount] = useState(0); //postData.commentsCount ||

  const handleLike = () => {
    setLikesCount(likesCount + 1);
    // Add logic to update like count in the backend
  };

  const handleComment = () => {
    // Add logic to open comment section or redirect to comment page
  };

  const handleShare = () => {
    // Add logic to share the post
  };
  if (postData.userId) {

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
        <div className='post-user-header'>
          {profileImage && <img src={profileImage} alt="Post" className="user-image" />}
          <h3>{postData.userId.fullName && ''} @{userHandle}</h3>
          <p>{formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}</p>
        </div>
        <div className="post-details" id={postData._id}>
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
