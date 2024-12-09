import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./views/components/errorPage/ErrorPage";
import Login from "./views/components/login/Login";
import Register from "./views/components/register/Register";
import { lazy, Suspense } from "react";

const Home = lazy(() => import('../../client/src/pages/home/HomePage'));



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement:<ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      
    ]
    
  },
  {
    path: "/home",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    ),
    errorElement:<ErrorPage />,
  }
  
 
]);
