import authMiddleware from "../middleware/authMiddleware" ; 
import express from "express";
import { uploadProfilePicture } from "../controllers/uploadPictureController";
import getCurrentUser from "../controllers/userData";
import cors from "cors";
import { findUsersByUsername } from "../controllers/userController";


const router = express.Router();
router.use(cors({ origin: "http://localhost:5173", credentials: true }));
router.post('/upload-profile-picture', uploadProfilePicture);
router.get('/get-current-user', getCurrentUser);
router.post('/find-users-by-username',findUsersByUsername);

export default router;