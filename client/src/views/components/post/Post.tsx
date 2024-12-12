import { FC, useContext } from 'react';
import './Post.scss';
import { productionState } from "../../../pages/home/HomePage"; 


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
    _id: string;
  };
}

const Post: FC<PostType> = (postData) => {
  const state = useContext(productionState);

  if (!postData.userId) return <div>No user data available.</div>;
  console.log('postData:', postData);
  const userHandle = postData.userId.fullName
    .split(" ")
    .map((part) => part.toLowerCase().trim())
    .join("") || "";
  let imageUrl = postData.image;
  if(imageUrl){
    imageUrl = imageUrl.includes('uploads\\posts') ? `${state.url.length > 0 ? state.url : '../../../../../'}/` + postData.image : postData.image;
  }
  console.log('imageUrl:', imageUrl);
  return (
    <div className="post">
      <h3>{postData.userId.fullName && ''} @{userHandle}</h3>
      <p>{postData.content}</p>
      {postData.image && <img src={imageUrl} alt="Post" className="post__image" />}
    </div>
  );
}

export default Post;
