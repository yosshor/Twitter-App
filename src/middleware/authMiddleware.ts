import jwt from "jsonwebtoken";
import jwt1 from "jwt-simple";

import { Request, Response, NextFunction } from "express";
import { getUserIdAndData } from "../controllers/uploadPictureController";

function authMiddleware(req: any, res: Response, next: NextFunction): void {
  const { userId, userData } = getUserIdAndData(req);
  console.log("userId", userId, "userData", userData);
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("token", token);

  if (!token) {
    console.log("access denied");
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET!);
    req.user = verified;
    // const { userTwitter } = req.cookies;
    const secret = process.env.SECRET!;
    const { userId, email } = jwt1.decode(token, secret);
    next();
  } catch (err) {
    console.error("middleware Error", err);
    res.status(400).json({ error: "Invalid token" });
  }
}

export default authMiddleware;
