import React from "react";

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
  const defaultImage = "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png"; 

  return (
    <div className="user-card">
      <img
        src={user.profileImage || defaultImage} 
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
        {user.isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserCard;
