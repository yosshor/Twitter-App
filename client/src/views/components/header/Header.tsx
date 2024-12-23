import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import { FC, useState } from 'react';
import { faRightFromBracket, faRightToBracket, faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import ActionButton from '../buttons/Buttons';
import handleSearchQuery from '../../../pages/search/Search';
import Search from '../../../pages/search/Search';
interface HeaderProps {
  isActive?: boolean;
}

const Header: FC<HeaderProps> = ({ isActive }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleLogOut = () => {
    console.log('User logged out!');
    document.cookie = "auth=; Max-Age=0; path=/";
    document.cookie = "userTwitter=; Max-Age=0; path=/";
    document.cookie = "search=; Max-Age=0; path=/";
    navigate('/'); // Redirect to home page
  };

  const handleLogIn = () => {
    console.log('User logged in!');
  };

  const handleRegister = () => {
    console.log('User registering...');
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery}`);
    document.cookie = `search=${searchQuery}; path=/`;
    navigate('search', { state: { searchQuery } });
    // handleSearchQuery(searchQuery);
    // <Search />;
  };

  const activeClass = isActive ? 'active-link' : 'inactive-link';

  return (
    <header className='header'>
      <div className='logo-header'>
        <div className='logo'>
          <img src='https://seeklogo.com/images/T/twitter-icon-square-logo-108D17D373-seeklogo.com.png' alt='Twitter logo' />
          <h2 className='title'>Twitter</h2>
        </div>
      </div>
      {isActive === false ? (
        <div className='user-actions'>
          <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
            <Link to="/login" className={activeClass}>
              <button className='button'>
                <ActionButton icon={faRightToBracket} label="Login" onClick={handleLogIn} />
              </button>
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
            <Link to="/register" className={activeClass}>
              <button className='button'>
                <ActionButton icon={faUserPlus} label="Register" onClick={handleRegister} />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="user-actions-logged-in">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px', width: '12vw', top: '10px',
                position: 'absolute', borderRadius: '20px', border: 'none',
              }}
            />
            <button className="search-button" >
              <ActionButton icon={faSearch} label="Search" onClick={handleSearch}/>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '20px', padding: '20px', paddingLeft: '20px' }}>
            <Link to="/" className={activeClass}>
              <button className='button'>
                <ActionButton icon={faRightFromBracket} label="Logout" onClick={handleLogOut} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;