import getCurrentUser from '../../../utils/get-current-user/get-current-user';
import './Sidebar.scss';



interface userDetails {
  fullName: string;
  email: string;
  password: string;
  profileImage: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}


const userData = async ():Promise<userDetails> => {
  const user = await getCurrentUser();
  console.log('user', user);
  return user;
}
const userDetails = await userData();


function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Twitter_Logo_2012.svg"
          alt="Twitter Logo"
          className="sidebar__profileImage"
        />
        <h2>{userDetails.fullName}</h2>
        <p>Bio goes here...</p>
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
