import { Link } from 'react-router-dom'
import './Header.scss'
import { FC } from 'react';
import { faRightFromBracket, faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import ActionButton from '../buttons/Buttons';


interface HeaderProps {
  // Define props for Header component
  isActive?: boolean;
}

const Header: FC<HeaderProps> = ({ isActive }) => {

  const handleLogOut = () => {
    console.log('User logged out!');
  };

  const handleLogIn = () => {
    console.log('User logged in!');
  };

  const handleRegister = () => {
    console.log('User registering...');
  };
  console.log('isActive:', isActive); // Logs isActive prop
  const activeClass = isActive ? 'active-link' : 'inactive-link';
  const header = <div>
    <header className='header'>
      <div className='logo-header'>
        <div className='logo'>
          <img src='https://seeklogo.com/images/T/twitter-icon-square-logo-108D17D373-seeklogo.com.png' alt='Twitter logo' />
        </div>
        <Link to="/">
          <h1 className='title'>Twitter</h1>
        </Link>
      </div>
      {isActive === false ? <div className='user-actions'>
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
      </div> :
        <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
          <Link to="/" className={activeClass}>
            <button className='button'>
              <ActionButton icon={faRightFromBracket} label="Logout" onClick={handleLogOut} />
            </button>
          </Link>
        </div>
      }
    </header>
  </div>

  return (
    header
  )
}

export default Header