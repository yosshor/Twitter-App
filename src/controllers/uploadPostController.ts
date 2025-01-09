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
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "postId",
            as: "likesDetails",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postId",
            as: "commentsDetails",
          },
        },
        {
          $unwind: {
            path: "$commentsDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "commentsDetails.userId",
            foreignField: "_id",
            as: "commentsDetails.userDetails",
          },
        },
        {
          $unwind: {
            path: "$commentsDetails.userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            userDetails: { $first: "$userDetails" },
            likesDetails: { $first: "$likesDetails" },
            commentsDetails: { $push: "$commentsDetails" },
            content: { $first: "$content" },
            profileImage: { $first: "$userDetails.profileImage" },
            image: { $first: "$image" },
            createdAt: { $first: "$createdAt" },
            followersCount: { $first: "$followersCount" },
          },
        },
        {
          $project: {
            _id: 1,
            userDetails: {
              fullName: 1,
              email: 1,
              createdAt: 1,
              profileImage: 1,
              _id: 1,
            },
            likesDetails: {
              userId: 1,
              createdAt: 1,
            },
            commentsDetails: {
              userId: 1,
              content: 1,
              createdAt: 1,
              userDetails: {
                profileImage: 1,
                fullName: 1,
              },
            },
            followersCount: 1,
            content: 1,
            profileImage: "$userDetails.profileImage", // Include the profileImage from userDetails
            image: 1, // Include the post image
            createdAt: 1,
          },
        },
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
