import multer from "multer";
import path from "path";
import { getUserIdAndData } from "./uploadPictureController";
import { Post } from "../models/Post";
import fs from "fs";
import mongoose from "mongoose";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/posts/");
  },
  filename: (req: any, file: any, cb: any) => {
    const postId = req.postId; 
    cb(null, `${postId}${path.extname(file.originalname)}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });
// Controller to handle profile picture upload
export const uploadPostPicture = [
  upload.single("image"),
  async (req: any, res: any) => {
    try {
      const postId = req.postId; // req.query.postId;
      console.log("postId", postId);

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Save the new image path into the post details
      post.image = req.file.path;
      await post.save();

      // Use aggregate to get userDetails and likesDetails
      const postWithDetails = await Post.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(postId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        { $unwind: '$userDetails' },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'postId',
            as: 'likesDetails'
          }
        },
        {
          $project: {
            'userDetails.fullName': 1,
            'userDetails.email': 1,
            'userDetails.createdAt': 1,
            'userDetails.profileImage': 1,
            'likesDetails.userId': 1,
            'likesDetails.createdAt': 1,
            followersCount: 1,
            content: 1,
            profileImage: '$userDetails.profileImage', // Include the profileImage from userDetails
            image: 1, // Include the post image
            createdAt: 1
          }
        }
      ]);

      console.log("postWithDetails", postWithDetails);
      if (postWithDetails.length > 0) {
        res.status(200).json(postWithDetails[0]);
      } else {
        res.status(404).json({ error: "Post not found" });
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
