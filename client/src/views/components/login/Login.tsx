import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Login.scss"; // Import the compiled CSS from SCSS

async function login(username: string, email: string, password: string): Promise<any | null> {
  try {
    console.log(JSON.stringify({ username, email, password }));
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      console.log(token);
      document.cookie = `auth=${token}; path=/`;
      window.location.href = "../show-all-recipes/index.html";
    } else {
      console.log(response);
      Swal.fire("SignIn", "Sign-in failed! Please Try Again", "warning");
    }
  } catch (error) {
    Swal.fire("Failed", String(error), "warning");
    console.error(error);
  }
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(username, email, password);
  };

  return (
    <div>
      <div id="auth-forms">
        <form id="sign-in-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <input
            type="text"
            name="username"
            id="sign-in-username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
