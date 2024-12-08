import authMiddleware from "../middleware/authMiddleware" ; 
import express from "express";
import { uploadProfilePicture } from "../controllers/uploadPictureController";
import getCurrentUser from "../controllers/userData";

const router = express.Router();
router.post('/upload-profile-picture', uploadProfilePicture);
router.get('/get-current-user', getCurrentUser);

export default router;