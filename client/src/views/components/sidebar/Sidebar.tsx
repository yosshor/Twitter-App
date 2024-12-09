import './Sidebar.scss';
import type { userDetails } from '../../../../../src/models/User';
import { FC } from 'react';
interface SidebarProps {
  userData: userDetails;
}


const Sidebar: FC<SidebarProps> = ({ userData }) => {
  console.log('userData', userData);
  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Twitter_Logo_2012.svg"
          alt="Twitter Logo"
          className="sidebar__profileImage"
        />
        <p>{userData.fullName}</p>
        <p>{userData.email}</p>
      </div>
      <div className="sidebar__links">
        <button>Home</button>
        <button>Profile</button>
        <button>Lists</button>
        <button>Topics</button>
      </div>
    </div>
  );
}

export default Sidebar;
