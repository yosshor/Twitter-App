import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './views/components/errorPage/ErrorPage';
import Login from './views/components/login/Login';
import Register from './views/components/register/Register';
import { lazy, Suspense } from 'react';
import UserProfile from './pages/profile/UserProfile';
import Layout from '../src/views/components/layout/Layout'; 

const Home = lazy(() => import('../../client/src/pages/home/HomePage'));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
    ]
  },
  {
    path: "/home",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout />  {/* Wrap Home page in Layout */}
      </Suspense>
    ),
    children: [
      {
        path: "/home",  // Ensure the Home page is rendered within the layout
        element: <Home />
      },
    ],
  },
]);
