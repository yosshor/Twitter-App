import { FC, useContext, useState, useEffect } from 'react';
import './Post.scss';
import { productionState } from "../../../pages/home/HomePage";
import { formatDistanceToNow } from 'date-fns';
import PostActions from '../postActions/PostActions';
import { useNavigate, useParams } from 'react-router-dom';

export interface PostType {
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  likesDetails: string[];
  userDetails: {
    fullName: string;
    email: string;
    createdAd: Date;
    profileImage: string;
    _id: string;
  };
}




const Post: FC<{ postData?: PostType }> = ({ postData }) => {
  const state = useContext(productionState);
  const [likesCount, setLikesCount] = useState(postData?.likesDetails?.length || 0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [url, setUrl] = useState(location.pathname + location.search);
  const navigate = useNavigate();
  // const { id } = useParams<{ id: string }>();

  useEffect(() => {
    console.log("Current URL:", url);
  }, [location]);



  const handleUserClick = (e: any) => {
    const userId = e.currentTarget.id;
    console.log("user clicked", userId);
    if(!url.includes('profile')) navigate(`profile/${userId}`);
  }
  const handlePostClick = (e: any) => {
    console.log("Post clicked", e.target.id);
  }
  useEffect(() => {
    if (postData && postData.likesDetails && postData.userDetails?._id) {
      const userLiked = postData.likesDetails.findIndex((like: any) => like.userDetails === postData.userDetails._id);
      if (userLiked > -1) setLiked(true);
    }
    else {
      setLikesCount(0);
    }
  }, [postData]);

  if (!postData || !postData.userDetails) {
    return <div>No user data available.</div>;
  }

  // Validate and format the date
  const createdAt = postData?.createdAt ? new Date(postData.createdAt) : null;
  const timeAgo = createdAt && !isNaN(createdAt.getTime())
    ? formatDistanceToNow(createdAt, { addSuffix: true })
    : "Invalid date";

  const userHandle = postData!.userDetails.fullName
    .split(" ")
    .map((part) => part.toLowerCase().trim())
    .join("") || "";

  let imageUrl = postData.image;
  let profileImage = 'https://i1.sndcdn.com/artworks-000189080723-ez2uad-t500x500.jpg';
  if (imageUrl) {
    imageUrl = imageUrl.includes('uploads\\posts') ? `${state.url.length > 0 ? state.url : '../../../../../'}/` + postData.image : postData.image;
  }
  if (postData.userDetails.profileImage) {
    profileImage = postData.userDetails.profileImage.includes('uploads\\users') ? `${state.url.length > 0 ? state.url : '../../../../../'}/`
      + postData.userDetails.profileImage : postData.userDetails.profileImage;
  }
  return (
    <div className="post">
      <div onClick={handleUserClick} className="post-user-header" id={postData!.userDetails._id}>
        <img src={profileImage} alt="User" className="user-image" />
        <h3>{postData!.userDetails.fullName} @{userHandle}</h3>
        <p>{timeAgo}</p>
      </div>
      <div onClick={handlePostClick} className="post-details" id={postData!._id}>
        <p>{postData!.content}</p>
        {postData.image && <img src={imageUrl} alt="Post" className="post__image" />}

      </div>
      <PostActions
        onLike={() => setLikesCount(likesCount + 1)}
        onComment={() => console.log('Comment')}
        onShare={() => console.log('Share')}
        likesCount={likesCount}
        commentsCount={commentsCount}
        id={postData!._id}
        userLiked={liked}
      />
    </div>
  );
};

export default Post;


