import { FC, useContext, useState, useEffect } from 'react';
import './Post.scss';
import { productionState, userToken } from "../../../pages/home/HomePage";
import PostActions from '../postActions/PostActions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Comment from "../../../views/components/comment/Comment";
import e from 'express';
import TwitterReplies from '../replies/Replies';
import { formatTimeAgo } from "../../../utils/get-formated-date";

export interface PostType {
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  likesDetails: string[];
  commentsDetails: {
    userId: string;
    content: string;
    createdAt: string;
    userDetails: {
      profileImage: string;
      fullName: string;
    };
  }[]; userDetails: {
    fullName: string;
    email: string;
    createdAd: Date;
    profileImage: string;
    _id: string;
  };
}




const Post: FC<{ userId: string, postData?: PostType }> = ({ userId, postData }) => {
  const state = useContext(productionState);
  const [likesCount, setLikesCount] = useState(postData?.likesDetails?.length || 0);
  const [commentsCount, setCommentsCount] = useState(postData?.commentsDetails?.filter(comment => comment.userDetails
    && comment.userDetails.fullName).length || 0);
  const [liked, setLiked] = useState(false);
  const [url, setUrl] = useState(location.pathname + location.search);
  const navigate = useNavigate();
  const userTokenDetails = useContext(userToken);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const handleUserClick = (e: any) => {
    const userId = e.currentTarget.id;
    console.log("user clicked", userId);
    if (!url.includes('profile')) navigate(`profile/${userId}`);
  }
  const handlePostClick = (e: any) => {
    console.log("Post clicked", e.currentTarget.id);
  }
  const handleCommentClick = (e: any) => {
    console.log("comment clicked", postData?._id);
    setShowCommentInput(!showCommentInput);
  }

  const addComment = (newComment: any) => {
    if (
      newComment &&
      newComment.comment &&
      newComment.comment._id &&
      newComment.comment.content &&
      newComment.comment.createdAt &&
      newComment.userData &&
      newComment.userData.profileImage &&
      newComment.userData.fullName
    ) {
      setCommentsCount(commentsCount + 1);
      console.log("newComment", newComment);
      const comment = {
        userId: newComment.comment._id,
        content: newComment.comment.content,
        createdAt: newComment.comment.createdAt,
        userDetails: {
          profileImage: newComment.userData.profileImage,
          fullName: newComment.userData.fullName
        }
      };
      console.log("comment", comment);
      postData?.commentsDetails.push(comment.content && comment);
    } else {
      console.error("Invalid comment data:", newComment);
    }
  };

  useEffect(() => {
    setShowComment(!url.includes('profile') ? false : true);
    if (postData && postData.likesDetails) {
      const userLiked = postData.likesDetails.findIndex((like: any) => like.userId === userId);
      if (userLiked > -1) {
        setLiked(true);
      }
      else {
        setLiked(false);
      }
    }
    else {
      setLikesCount(0);
    }
    // Filter out empty comments
    if (postData && postData.commentsDetails) {
      postData.commentsDetails = postData.commentsDetails.filter(comment => comment.userDetails && comment.userDetails.fullName);
      setCommentsCount(postData.commentsDetails.length);
    }
  }, [postData, userId]);

  if (!postData || !postData.userDetails) {
    return <div>No user data available.</div>;
  }

  const userHandle = postData!.userDetails.fullName
    .split(" ")
    .map((part) => part.toLowerCase().trim())
    .join("") || "";

  let imageUrl = postData.image;
  let profileImage = 'https://i1.sndcdn.com/artworks-000189080723-ez2uad-t500x500.jpg';
  let postUserImage = 'https://i1.sndcdn.com/artworks-000189080723-ez2uad-t500x500.jpg';
  if (imageUrl) {
    imageUrl = imageUrl.includes('uploads\\posts') ? `${state.url.length > 0 ? state.url : '../../../../../'}/` + postData.image : postData.image;
  }
  if (postData.userDetails.profileImage) {
    profileImage = postData.userDetails.profileImage.includes('uploads\\users') ? `${state.url.length > 0 ? state.url : '../../../../../'}/`
      + postData.userDetails.profileImage : postData.userDetails.profileImage;
  }
  if (postData.commentsDetails.length > 0 && postData.commentsDetails[0].userDetails && postData.commentsDetails[0].userDetails.profileImage) {
    postUserImage = postData.commentsDetails[0].userDetails.profileImage.includes('uploads\\users') ? `${state.url.length > 0 ? state.url : '../../../../../'}/`
      + postData.commentsDetails[0].userDetails.profileImage : postData.commentsDetails[0].userDetails.profileImage;
  }

  return (
    <div className="post">
      <div onClick={handleUserClick} className="post-user-header" id={postData!.userDetails._id}>
        <img src={profileImage} alt="User" className="user-image" />
        <h3>{postData!.userDetails.fullName} @{userHandle}</h3>
        <p>{formatTimeAgo(postData?.createdAt)}</p>
      </div>
      <div onClick={handlePostClick} className="post-details" id={postData!._id}>
        <p>{postData!.content}</p>
        {postData.image && <img src={imageUrl} alt="Post" className="post__image" />}

      </div>
      <PostActions
        onLike={() => setLikesCount(likesCount + 1)}
        onComment={() => handleCommentClick(event)}
        onShare={() => console.log('Share')}
        likesCount={likesCount}
        commentsCount={commentsCount}
        id={postData!._id}
        userLiked={liked}
      />
      {showCommentInput && (
        <Comment postId={postData._id} addComment={addComment} />
      )}
      {showComment && postData.commentsDetails && postData.commentsDetails.filter(comment => Object.keys(comment).length > 0).length > 0 && (
        <TwitterReplies commentsDetails={postData.commentsDetails} state={state} />
      )}



    </div>
  );
};

export default Post;


