import authMiddleware from "../middleware/authMiddleware" ; 
import express from "express";
import { uploadProfilePicture } from "../controllers/uploadPictureController";
import getUserData from "../controllers/userData";

const router = express.Router();
router.post('/upload-profile-picture', uploadProfilePicture);
router.get('/get-user-data', getUserData);

export default router;