import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import "./Login.scss"; // Import the compiled CSS from SCSS
import { useNavigate } from "react-router-dom";
import { productionState } from "../../../pages/home/HomePage";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook inside the component
  const state = useContext(productionState);

  // Refactored login function to use navigate inside the component
  const login = async (email: string, password: string): Promise<any | null> => {
    try {
      console.log(JSON.stringify({ email, password }));
      const url = `${state.url}/api/auth/login`
      console.log(url,document.cookie.split("userTwitter=")[1]);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.split("userTwitter=")[1]}`,
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, jwtToken } = await response.json();
        document.cookie = `auth=${token}; path=/`;
        document.cookie = `userTwitter=${jwtToken}; path=/`;

        // Redirect to the home page after login
        navigate("/home"); // Programmatically navigate to "/home"
      } else {
        console.log(response);
        Swal.fire("SignIn", "Sign-in failed! Please Try Again", "warning");
      }
    } catch (error) {
      Swal.fire("Failed", String(error), "warning");
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <div>
      <div id="auth-forms">
        <form id="sign-in-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <input
            type="text"
            name="email"
            id="sign-in-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            id="sign-in-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" id="sign-in">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
