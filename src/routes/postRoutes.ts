import express from "express";
import {
  createPost,
  getAllPosts,
  addComment,
  searchPost,
  searchPostIngredients,
  deletePost,
  getPostData,
  updatePost,
  searchPostsCategory,
  likePost,
  getUserPosts
} from "../controllers/postController";
import multer from "multer";

import authMiddleware from "../middleware/authMiddleware";
import twitterMiddleware, { twitterGetPostId } from "../middleware/twitterMidd";
import { uploadRecipePicture } from "../controllers/uploadRecipeController";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

router.post("/",authMiddleware, upload.single("image"), createPost); //authMiddleware
router.put("/update-post", twitterMiddleware, updatePost);
router.post("/upload-post-picture", twitterGetPostId, uploadRecipePicture);
router.get("/get-all", twitterMiddleware, getAllPosts);
router.get("/get-post-details/:Id", twitterMiddleware, getPostData);
router.post("/:id/like", twitterMiddleware, likePost);
router.post("/:id/comment", twitterMiddleware, addComment);
router.get("/search", twitterMiddleware, searchPost);
// router.get("/search-ingredients", twitterMiddleware, searchPostIngredients);
router.get("/search-post", twitterMiddleware, searchPostsCategory);
router.post("/get-user-posts", twitterMiddleware, getUserPosts);
router.delete("/:Id/delete", twitterMiddleware, deletePost);

// module.exports = router;
export default router;
