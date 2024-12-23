import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './views/components/errorPage/ErrorPage';
import Login from './views/components/login/Login';
import Register from './views/components/register/Register';
import { lazy, Suspense } from 'react';
// import UserProfile from './pages/profile/UserProfile';
import Layout from '../src/views/components/layout/Layout'; 

const Home = lazy(() => import('../../client/src/pages/home/HomePage'));
const Search = lazy(() => import('../../client/src/pages/search/Search'));
const UserProfile = lazy(() => import('./pages/profile/UserProfile'));


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
      // {
      //   path: "/profile",
      //   element: <UserProfile />,
      // },
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
        path: "", // Relative path for the home component (matches "/home")
        element: <Home />,
      },
      {
        path: "profile", 
        element: <UserProfile />,
      },
      {
        path: "profile/:id", // Dynamic path for profile with user ID
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "posts", // Example for posts route (matches "/home/posts")
        element: <div>Posts Page</div>, // Replace with your Posts component
      },
      {
        path: "search", 
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Search />
          </Suspense>
        ),
      },
      
      
    ],
  },
]);
