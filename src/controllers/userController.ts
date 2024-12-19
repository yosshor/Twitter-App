import { Request, Response } from "express";
import User from "../models/User";
import { Following } from "../models/Following";

import { Types } from "mongoose";
import { error } from "console";

export const findUsersByUsername = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.body;
    const currentUserId = req.userId;

    console.log("Got Here", username);
    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const users = await User.find({
      fullName: { $regex: username, $options: "i" },
    });

    const following = await Following.findOne({ userId: currentUserId });

    const usersWithFollowingStatus = users.map((user) => ({
      ...user.toObject(),
      isFollowing: following?.followingList.some(
        (id) => id.toString() === user._id.toString()
      ),
    }));

    res.status(200).json(usersWithFollowingStatus);
  } catch (error) {
    console.error("Error finding users by username:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      res.status(500).json({ message: "Server error", error: String(error) });
    }
  }
};
export const followUser = async (req: any, res: any) => {
  try {
    const userIdToFollow = req.body.userId;
    const userId = req.userId;
    if (!userIdToFollow || !Types.ObjectId.isValid(userIdToFollow)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    if (userId === userIdToFollow) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    let following = await Following.findOne({ userId });
    if (!following) {
      following = new Following({
        userId,
        followingList: [],
      });
    }

    const isAlreadyFollowing = following.followingList.some(
      (id) => id.toString() === userIdToFollow
    );

    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    following.followingList.push(userIdToFollow);

    await following.save();

    res
      .status(200)
      .json({ message: `You are now following ${userToFollow.fullName}` });
  } catch (error) {
    console.error("Error in followUser:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
