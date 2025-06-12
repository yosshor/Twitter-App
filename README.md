# TwitterApp

This repository contains a full-stack Twitter-like application built with React, TypeScript, Node.js, Express, and MongoDB. The application allows users to register, log in, create posts, comment on posts, like posts, and follow other users.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yosshor/Twitter-App.git 
    cd twitterapp
    ```

2. Install server dependencies:

    ```sh
    npm install
    ```

3. Install client dependencies:

    ```sh
    cd client
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    SECRET=your_jwt_secret
    MONGO_DB_CONNECTION=your_mongodb_connection_string
    PORT=3000
    ```

## Usage

1. Start the server:

    ```sh
    npm run dev
    ```

2. Start the client:

    ```sh
    cd client
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:5173`.

## Project Structure

```plaintext
.env
.gitignore
client/
  .gitignore
  eslint.config.js
  index.html
  package.json
  public/
  README.md
  src/
    App.scss
    App.tsx
    assets/
    hooks/
    index.css
    main.tsx
    pages/
    router.tsx
    utils/
    views/
    vite-env.d.ts
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
package.json
src/
  controllers/
    autoController.ts
    postController.ts
    uploadPictureController.ts
  middleware/
  models/
  routes/
  server.ts
tsconfig.json
uploads/
  posts/
  users/
```

### Client

- `client/src/main.tsx`: Entry point for the React application.
- `client/src/router.tsx`: Defines the routes for the application.
- `client/src/views/components`: Contains React components for various parts of the application.
- `client/src/pages`: Contains page components for different routes.

### Server

- `src/server.ts`: Entry point for the Express server.
- `src/controllers`: Contains controller functions for handling API requests.
- `src/models`: Contains Mongoose models for MongoDB collections.
- `src/routes`: Defines the API routes for the server.
- `src/middleware`: Contains middleware functions for the server.

## API Endpoints

### Auth Endpoints

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user.

### Users Endpoints

- `GET /api/users/get-current-user`: Get the current user's data.
- `GET /api/users/get-current-user-min-details`: Get minimal data for the current user.
- `POST /api/users/find-users-by-username`: Find users by username.
- `POST /api/users/follow-user`: Follow or unfollow a user.
- `POST /api/users/upload-profile-picture`: Upload a profile picture.

### Posts Endpoints

- `POST /api/post`: Create a new post.
- `PUT /api/post/update-post`: Update a post.
- `POST /api/post/upload-post-picture`: Upload a picture for a post.
- `GET /api/post/get-all`: Get all posts.
- `GET /api/post/get-post-details/:Id`: Get details of a specific post.
- `POST /api/post/:id/like`: Like or unlike a post.
- `POST /api/post/:id/comment`: Add a comment to a post.
- `DELETE /api/post/:id/delete`: Delete a post.


## Environment Variables

- `SECRET`: JWT secret key.
- `MONGO_DB_CONNECTION`: MongoDB connection string.
- `PORT`: Port number for the server.



## License

This project is licensed under the MIT License.

