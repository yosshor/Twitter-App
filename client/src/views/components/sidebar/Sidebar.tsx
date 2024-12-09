import './Sidebar.scss';
import type { userDetails } from '../../../../../src/models/User';
import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ActionButton from '../buttons/Buttons';
import { faClipboard, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
interface SidebarProps {
  userData: userDetails;
}


const Sidebar: FC<SidebarProps> = ({ userData }) => {

  const handleProfile = () => console.log('Navigating to user profile...');
  const handleHome = () => console.log('Navigating to Home...');
  const handlePost = () => console.log('Navigating to Post page...');


  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <img
          src={`../../../../../${userData.profileImage}`} // This is the path to the user's profile image
          alt="Twitter Logo"
          className="sidebar__profileImage"
        />
        <p>Welcome {userData.fullName}</p>
      </div>
      <div className="sidebar__links">
        <Link to="/home" >
          <button className='button'>
            <ActionButton icon={faHouse} label="Home" onClick={handleHome} />
          </button>
        </Link>
        <div>
          <Link to="/profile" >
            <button className='button'>
              <ActionButton icon={faUser} label="Profile" onClick={handleProfile} />
            </button>
          </Link>
        </div>
        <div>
          <Link to="/posts" >
            <button className='button'>
            <ActionButton icon={faClipboard} label="Posts" onClick={handlePost} />
            </button>
          </Link>
        </div>
        <button>Topics</button>
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;
