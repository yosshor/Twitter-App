import mongoose, { mongo } from "mongoose";
import { getUserIdAndData } from "./uploadPictureController";

export default async function getCurrentUser(
  req: any,
  res: any
): Promise<void> {
  try {
    const { userId, userData } = getUserIdAndData(req);
    const searchUserId = req.header("UserId");
    const user = await mongoose.model("User").aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(searchUserId ?? userId) } },
      {
        $lookup: {
          from: "followings",
          localField: "_id",
          foreignField: "userId",
          as: "followingDetails",
        },
      },
      {
        $lookup: {
          from: "followings",
          localField: "_id",
          foreignField: "followingList",
          as: "followerDetails",
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          createdAt: 1,
          profileImage: 1, // Include this field explicitly
          followingDetails: 1,
          followerDetails: 1,
        },
      },
    ]);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    //check if user is following
    const followings = user[0].followingDetails[0];
    const isFollowing = followings
      ? followings.followingList.some(
          (id: any) => id.toString() === userId.toString()
        )
      : false;
    res
      .status(200)
      .json({
        userId: userId,
        userData:  { ...(typeof userData === 'object' && userData !== null ? userData : {}), isFollowing: isFollowing },
        user: user,
      });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}

export async function getMinDataForCurrentUser(
  req: any,
  res: any
): Promise<void> {
  try {
    const { userId, userData } = getUserIdAndData(req);
    if (!userId && !userData) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ userId: userId, userData: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}
