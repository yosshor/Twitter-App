import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./views/components/errorPage/ErrorPage";
import Login from "./views/components/login/Login";
import Register from "./views/components/register/Register";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement:<ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />
      },
      {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorPage />
      }
    ]
  },
  {
    path: "/home",
    element: <Home />,
  }
 
]);
