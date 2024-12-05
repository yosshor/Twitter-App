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
          <Link to="/">
            <h1 className='title'>Twitter</h1>
          </Link>
        </div>
        <div className='user-actions'>
          <div id="user-actions">
            <Link to="/login"><button className='button'>Login</button></Link>
          </div>
          <div id="user-actions">
            <Link to="/register"><button className='button'>Register</button></Link>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header