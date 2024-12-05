import multer from "multer";
import path from "path";
import { getUserIdAndData } from "./uploadPictureController";
import { Post } from "../models/Post";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/recipes/");
  },
  filename: (req: any, file: any, cb: any) => {
    // const { userId, userData } = getUserIdAndData(req);
    const recipeId = req.recipeId; // req.query.recipeId;
    cb(null, `${recipeId}${path.extname(file.originalname)}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });
// Controller to handle profile picture upload
export const uploadRecipePicture = [
  upload.single("image"),
  async (req: any, res: any) => {
    try {
      const postId = req.postId; // req.query.postId;
      const post = await Post.findById(postId);
      if (post) {
        // // If the recipe has already an image, delete it
        // deleteImageIfExist(req);

        // Save the new image path into the recipe details
        post.image = req.file.path;
        await post.save();
        console.log("successfully upload and save path into recipe details");
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
];

function deleteImageIfExist(req: any): void {
  if (fs.existsSync(req.file.path)) {
    console.log("file exists");
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting existing image:", err);
      } else {
        console.log("Existing image deleted:", req.file.path);
      }
    });
  }
}
