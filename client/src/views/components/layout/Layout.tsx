import { FC } from 'react';

import { Outlet } from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser'; // assuming you have this hook
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import './Layout.scss';

const Layout: FC = () => {
  const { userData, loading } = useCurrentUser();

  return (
    <div className="home">
      <Header isActive={!!userData} />
      <div className="main-content">
        {userData && <Sidebar userData={userData} />}
        <div className="content">
          {loading ? <div>Loading user data...</div> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
