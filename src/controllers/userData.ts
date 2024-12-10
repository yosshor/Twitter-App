import mongoose, { mongo } from "mongoose";
import { getUserIdAndData } from "./uploadPictureController";

export default async function getCurrentUser(req: any, res: any): Promise<void> {
  try {
    const { userId, userData } = getUserIdAndData(req);
    

    console.log("userId", userId);
    const user = await mongoose.model("User").findOne({ _id: userId });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ userId: userId, userData: userData, user: user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}
