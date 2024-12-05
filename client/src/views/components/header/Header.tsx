import { Link } from 'react-router-dom'
import './Header.scss'

const Header = () => {
  return (
    <div>
      {/* Header Section */}
      <header className='header'>
        <div className='logo-header'>
          <div className='logo'>
            <img src='https://seeklogo.com/images/T/twitter-icon-square-logo-108D17D373-seeklogo.com.png' alt='Twitter logo' />
          </div>
          <Link className='button' to="/">
            <h1 className='title' style={{ color: 'black' }}>Twitter</h1>
          </Link>
        </div>
        <div className='user-actions'>
          <div id="user-actions">
            <Link className='button' to="/login">Login</Link>
          </div>
          <div id="user-actions">
            <Link className='button' to="/register">Register</Link>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header