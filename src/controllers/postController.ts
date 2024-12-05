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

    const {
      content,
      image
    } = req.body;
    const post = new Post({
      user: userId,
      content: content,
      image: image,
    });

    await post.save();
    res.status(200).send(post);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req: any, res: any) => {
  try {
    const { userId, userData } = getUserIdAndData(req);
    console.log("updatePost", req.body);
    const {
      content,
      image,
    } = req.body;
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
    const posts = await Post.find()
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "userId" },
      })
      .populate("likes");
    res.status(200).json(posts); // Send posts if successful
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
    const { userId, userData } = getUserIdAndData(req);
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // //check if user already liked the recipe
    // if (post.likes.includes(new mongoose.Types.ObjectId(userId))) {
    //   //remove like
    //   const like = await recipe.likes.findIndex(
    //     (like: any) => like.user === userId
    //   );
    //   recipe.likes.splice(like, 1);
    //   await recipe.save();
    //   return res
    //     .status(200)
    //     .json({ ok: "User already liked the recipe, remove him" });
    // }
    // recipe.likes.push(new mongoose.Types.ObjectId(userId));
    // await recipe.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to like recipe" });
  }
};

export const addComment = async (req: any, res: any): Promise<void> => {
  try {
    const { userId, userData } = getUserIdAndData(req);
    const { text } = req.body;

    const comment = new Comment({
      userId: userId,
      content: text,
      recipeId: req.params.id,
    });
    await comment.save();

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // recipe.comments.push(comment._id);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};
