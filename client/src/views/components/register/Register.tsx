import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Register.scss";


const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await registerUser(email, password, firstName, lastName, profilePicture);
    } catch (error) {
      console.error(error);
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    profilePicture: File | null
  ): Promise<void> => {
    try {
      const data = {
        email,
        password,
        firstName,
        lastName,
        profilePicture: profilePicture ?? null,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Registration successful");

        if (profilePicture) {
          const pictureFormData = new FormData();
          pictureFormData.append("profilePicture", profilePicture);

          const uploadResponse = await fetch("/api/users/upload-profile-picture", {
            method: "POST",
            body: pictureFormData,
          });

          if (uploadResponse.ok) {
            console.log("Profile picture uploaded successfully");
            const { token } = await response.json();
            document.cookie = `auth=${token}; path=/`;
            window.location.href = "../recipe/index.html";
          } else {
            Swal.fire("Upload Image", "Failed to upload profile picture!", "warning");
          }
        }
      } else {
        Swal.fire("User Exists", "User already exists, please login!", "warning");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div id="auth-forms">
        <form id="register-form" onSubmit={handleRegisterSubmit}>
          <h2>Register</h2>
          <div className="email">
            <label htmlFor="register-email">Email</label>
            <input
              type="email"
              name="email"
              id="register-email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="password">
            <label htmlFor="register-password">Password</label>
            <input
              type="password"
              name="password"
              id="register-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="first-name">
            <label htmlFor="register-firstname">First Name</label>
            <input
              type="text"
              name="firstName"
              id="register-firstname"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="last-name">
            <label htmlFor="register-lastname">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="register-lastname"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="profile-image">
            <label htmlFor="register-profile-picture">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              id="register-profile-picture"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            />
          </div>
            <button id="register" type="submit">
              Register
            </button>

        </form>
      </div>
    </div>
  );
};

export default Register;

