import authMiddleware from "../middleware/authMiddleware";
import express from "express";
import { uploadProfilePicture } from "../controllers/uploadPictureController";
import getCurrentUser, { getMinDataForCurrentUser } from "../controllers/userData";
import cors from "cors";
import { getUserPosts } from "../controllers/postController";
import twitterMiddleware from "../middleware/twitterMidd";


import { findUsersByUserName, followUser } from "../controllers/userController";


const router = express.Router();
router.use(cors({ origin: "http://localhost:5173", credentials: true }));
router.post("/upload-profile-picture", uploadProfilePicture);
router.get("/get-current-user", getCurrentUser);
router.get("/get-current-user-min-details", getMinDataForCurrentUser);

router.post("/find-users-by-username", findUsersByUserName);
router.post("/follow-user", twitterMiddleware, followUser);
// router.post("/following-count", getFollowingCount );
// router.post("/followers-count", getFollowersCount );

export default router;
