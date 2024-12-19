import React, { useContext } from "react";
import { productionState } from "../../../pages/home/HomePage";

interface UserCardProps {
  user: {
    _id: string;
    fullName: string;
    profileImage: string;
    isFollowing: boolean;
  };
  onFollow: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollow }) => {
  console.log("UserCard:", user);
  const state = useContext(productionState);
  const defaultImage = "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png";
  const url = (user.profileImage && user.profileImage.length > 0 && user.profileImage.includes('uploads\\users')) 
    ? `${state.url.length > 0 ? state.url : '../../../../../'}/` + user.profileImage 
    : user.profileImage || defaultImage;

  return (
    <div className="user-card">
      <img
        src={url}
        alt={`${user.fullName}'s profile`}
        className="user-card-image"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />
      <p className="user-card-name">{user.fullName}</p>
      <button onClick={onFollow}>
        {user.isFollowing ? "UnFollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserCard;