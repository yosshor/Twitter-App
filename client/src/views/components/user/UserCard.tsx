import React from 'react';
import './UserCard.scss'; 

interface UserCardProps {
  user: {
    fullName: string;
    profileImage: string; 
    _id: string;   
  };
  onFollow: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollow }) => {
  const handleFollow = () => {
    onFollow(user._id);
  };

  return (
    <div className="user-card">
      <img src={user.profileImage} alt={`${user.fullName}'s profile`} className="user-image" />
      <div className="user-details">
        <h3 className="user-username">{user.fullName}</h3>
        <button onClick={handleFollow} className="follow-button">
          Follow
        </button>
      </div>
    </div>
  );
};

export default UserCard;
