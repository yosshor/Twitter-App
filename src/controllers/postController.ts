import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { Like } from "../models/Like";
import User from "../models/User";
import jwt from "jwt-simple";
import { getUserIdAndData } from "./uploadPictureController";
import mongoose from "mongoose";

export const createPost = async (req: any, res: any) => {
  try {
    const { userId, userData } = getUserIdAndData(req);
    console.log("createPost", userId, userData);
    const { content } = req.body;
    const post = new Post({
      userId: userId,
      content: content,
      image: null,
    });

    await post.save();
    res.status(200).send(post);
  } catch (err: any) {
    console.error("create post error ", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req: any, res: any) => {
  try {
    const { userId, userData } = getUserIdAndData(req);
    console.log("updatePost", req.body);
    const { content, image } = req.body;
    const post = await Post.findById(req.body.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.userId.toString() !== userId) {
      return res.status(401).json({ error: "User not authorized" });
    }
    post.content = content;
    post.image = image;
    await post.save();
    res.status(200).send(post);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllPosts = async (req: Request, res: any) => {
  try {
    // Populate the user field to get all user information
    // Populate the userId field to get user information (only fullName and email)
    const posts = await Post.aggregate([
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
        $unwind: { path: "$commentsDetails", preserveNullAndEmptyArrays: true },
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
          "userDetails.fullName": 1,
          "userDetails.email": 1,
          "userDetails.createdAt": 1,
          "userDetails.profileImage": 1,
          "userDetails._id": 1,
          "likesDetails.userId": 1,
          "likesDetails.createdAt": 1,
          "commentsDetails.userId": 1,
          "commentsDetails.content": 1,
          "commentsDetails.createdAt": 1,
          "commentsDetails.userDetails.profileImage": 1,
          "commentsDetails.userDetails.fullName": 1, // Include the fullName from commentsDetails.userDetails

          followersCount: 1,
          content: 1,
          profileImage: "$userDetails.profileImage", // Include the profileImage from userDetails
          image: 1, // Include the post image
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ posts: posts }); // Send posts if successful
  } catch (error) {
    console.error("Error fetching posts:", error); // Log error details
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
export const getPostData = async (req: any, res: any) => {
  try {
    const postId = req.params.Id;
    // Populate the user field to get all user information
    const post = await Post.findById(postId)
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      })
      .populate("likes");
    res.status(200).json(post); // Send recipes if successful
  } catch (error) {
    console.error("Error fetching post:", error); // Log error details
    res.status(500).json({ error: "Failed to fetch post" });
  }
};
export const searchPost = async (req: any, res: any) => {
  try {
    const { query } = req.query;
    const posts = await Post.find({
      title: { $regex: query, $options: "i" },
    })
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      })
      .populate("likes");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const deletePost = async (req: any, res: any): Promise<void> => {
  try {
    const postId = req.params.Id;
    const { userId, userData } = getUserIdAndData(req);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.userId.toString() !== userId) {
      return res.status(401).json({ error: "User not authorized" });
    }
    await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: "Post removed" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete posts" });
  }
};

export const searchPostIngredients = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const { query } = req.query;
    const posts = await Post.find({
      ingredients: { $regex: query, $options: "i" },
    })
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      })
      .populate("likes");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const searchPostsCategory = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const { query } = req.query;
    const posts = await Post.find({
      category: { $regex: query, $options: "i" },
    })
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      })
      .populate("likes");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const likePost = async (req: any, res: any): Promise<void> => {
  try {
    const { userId } = getUserIdAndData(req);

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Remove like
    const searchLike = await Like.findOne({
      userId: userId,
      postId: post._id,
    });

    if (searchLike) {
      await Like.deleteOne({ _id: searchLike._id });
      post.likes = post.likes.filter(
        (likeId: any) => !likeId.equals(searchLike._id)
      );
      await post.save();
      console.log("Removed like", searchLike);
      return res.status(200).json({ message: "Like removed" });
    }

    // Add like
    const like = new Like({
      userId: userId,
      postId: req.params.id,
    });
    await like.save();
    post.likes.push(like._id);
    await post.save();
    console.log("Added like", like);
    res.json(like);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};

export const addComment = async (req: any, res: any): Promise<void> => {
  try {
    const { userId, userData } = getUserIdAndData(req);
    const { text } = req.body;

    const comment = new Comment({
      userId: userId,
      content: text,
      postId: req.params.id,
    });
    await comment.save();
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const user = await User.findById(userId);
    // recipe.comments.push(comment._id);
    await post.save();

    res.json({comment: comment, userData: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getUserPosts = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const getAnotherUserPost = req.header("UserId") ?? null;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const posts = await Post.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(getAnotherUserPost ?? userId),
        },
      },
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
        $unwind: { path: "$commentsDetails", preserveNullAndEmptyArrays: true },
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
          "userDetails.fullName": 1,
          "userDetails.email": 1,
          "userDetails.createdAt": 1,
          "userDetails.profileImage": 1,
          "likesDetails.userId": 1,
          "likesDetails.createdAt": 1,
          "commentsDetails.userId": 1,
          "commentsDetails.content": 1,
          "commentsDetails.createdAt": 1,
          "commentsDetails.userDetails.profileImage": 1,
          "commentsDetails.userDetails.fullName": 1, // Include the fullName from commentsDetails.userDetails
          followersCount: 1,
          content: 1,
          profileImage: "$userDetails.profileImage", // Include the profileImage from userDetails
          image: 1, // Include the post image
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostDetails = async (req: any, res: any) => {
  try {
    const postId = req.params.id;
    console.log("postId:", postId);

    if (!postId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await Post.find({ _id: postId })
      .populate({
        path: "userId", // Populate the userId field
        select: "fullName email createdAt profileImage",
      })
      .populate({
        path: "likes", // Populate the likes field
        select: "userId createdAt", // Adjust the fields you want to select from the likes table
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
