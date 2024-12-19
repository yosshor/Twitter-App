import './Sidebar.scss';
import type { userDetails } from '../../../../../src/models/User';
import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import ActionButton from '../buttons/Buttons';
import { faClipboard, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import { productionState } from "../../../pages/home/HomePage";

interface SidebarProps {
  userData: userDetails;
}


const Sidebar: FC<SidebarProps> = ({ userData }) => {
  const state = useContext(productionState);
  const handleProfile = () => console.log('Navigating to user profile...');
  const handleHome = () => console.log('Navigating to Home...');
  const handlePost = () => console.log('Navigating to Post page...');
  const imageUrl = `${state.url}/${userData.profileImage}`;
  console.log(imageUrl);
  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <img
          src={imageUrl} // This is the image URL
          alt="User Image"
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
          <Link to="profile" >
            <button className='button'>
              <ActionButton icon={faUser} label="Profile" onClick={handleProfile} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
