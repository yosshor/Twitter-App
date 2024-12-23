import { Request, Response } from "express";
import User from "../models/User";
import { Following } from "../models/Following";

import { Types } from "mongoose";
import { error } from "console";
import { Follower } from "../models/Followers";

export const findUsersByUserName = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const { username } = req.body;
    const currentUserId = req.userId;

    let followings = await Following.findOne({ currentUserId });
    if (!followings) {
      followings = new Following({
        currentUserId,
        followingList: [],
      });
    }

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const users = await User.find({
      fullName: { $regex: username, $options: "i" },
    });
    const usersWithFollowingStatus = users.map((user) => ({
      ...user.toObject(),
      isFollowing: followings
        ? followings.followingList.some(
            (id) => id.toString() === user._id.toString()
          )
        : false,
    }));

    console.log(usersWithFollowingStatus);
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

    console.log("userId user want to follow", userId, userIdToFollow);

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
      const index = following.followingList.findIndex(
        (id) => id.toString() === userIdToFollow
      );
      console.log("index", index);
      following.followingList.splice(index, 1);
      await following.save();
      return res.status(200).json({
        message: `You have unfollowed ${userToFollow.fullName}`,
        isFollowing: false,
      });
    } else {
      following.followingList.push(userId);

      await following.save();
      return res.status(200).json({
        message: `You are now following ${userToFollow.fullName}`,
        isFollowing: true,
      });
    }
  } catch (error) {
    console.error("Error in followUser:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
