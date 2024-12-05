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
} from "../controllers/postController";
import multer from "multer";

import authMiddleware from "../middleware/authMiddleware";
import recipeMiddleware, { recipeGetRecipeId } from "../middleware/recipeMidd";
import { uploadRecipePicture } from "../controllers/uploadRecipeController";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("image"), createPost);
router.put("/update-recipe", recipeMiddleware, updatePost);
router.post("/uploadRecipePicture", recipeGetRecipeId, uploadRecipePicture);
router.get("/get-all", recipeMiddleware, getAllPosts);
router.get("/get-recipe-details/:Id", recipeMiddleware, getPostData);
router.post("/:id/like",recipeMiddleware, likePost);
router.post("/:id/comment",recipeMiddleware, addComment);
router.get("/search", recipeMiddleware, searchPost);
router.get("/searchIngredients", recipeMiddleware, searchPostIngredients);
router.get("/searchCategory", recipeMiddleware, searchPostsCategory);

router.delete("/:Id/delete", recipeMiddleware, deletePost);


// module.exports = router;
export default router;
