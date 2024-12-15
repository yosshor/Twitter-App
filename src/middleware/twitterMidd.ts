import jwt from "jsonwebtoken";
import jwt1 from "jwt-simple";

import { Request, Response, NextFunction } from "express";
import { getUserIdAndData } from "../controllers/uploadPictureController";

export function twitterMiddleware(req: any, res: Response, next: NextFunction) {
  try {
    const { userData } = getUserIdAndData(req);
    if (!userData) {
      res.status(401).send({ error: "User not found" });
      return;
    }
    let parsedUserData;
    try {
      parsedUserData = JSON.parse(JSON.stringify(userData));
    } catch (error) {
      res.status(400).send({ error: "Invalid user data" });
      return;
    }
    const { userId, email, name, role } = parsedUserData;
    if (!userId) {
      res.status(401).send({ error: "User not found" });
      return;
    }
    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
  }
}

export function twitterGetPostId(req: any, res: Response, next: NextFunction) {
  const postId = req.query.postId;
  console.log("postId", postId);
  if (!postId) {
    res.status(400).send({ error: "Post not found" });
    return;
  }
  req.postId = postId;
  console.log(req.recipeId);
  next();
}

export default twitterMiddleware;
