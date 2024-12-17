import { Request, Response } from "express";
import  User  from "../models/User"; 
import { Following  } from "../models/Following";
import { Follower } from "../models/Followers";
import { Types } from "mongoose";


export const findUsersByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.body;

    console.log("Got Here",username);
    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    
    const users = await User.find({ fullName: { $regex: username, $options: "i" } });

    
    res.status(200).json(users);
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
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
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
      // Unfollow
      following.followingList = following.followingList.filter(
        (id) => id.toString() !== userIdToFollow
      );

      await following.save();

      
      let follower = await Follower.findOne({ userId: userIdToFollow });
      if (follower) {
        follower.followersList = follower.followersList.filter(
          (id) => id.toString() !== userId
        );
        await follower.save();
      }

      return res.status(200).json({
        message: `You have unfollowed ${userToFollow.fullName}`,
      });
    } else {
    
      following.followingList.push(userIdToFollow);

      await following.save();

    
      let follower = await Follower.findOne({ userId: userIdToFollow });
      if (!follower) {
        follower = new Follower({
          userId: userIdToFollow,
          followersList: [],
        });
      }

      follower.followersList.push(userId);
      await follower.save();

      return res.status(200).json({
        message: `You are now following ${userToFollow.fullName}`,
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
export const getFollowingCount = async (req: any, res: any): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid or missing user ID" });
      return;
    }


    const following = await Following.findOne({ userId });

    if (!following) {
   
      res.status(200).json({ followingCount: 0 });
      return;
    }

    const followingCount = following.followingList.length;
    res.status(200).json({ followingCount });
  } catch (error) {
    console.error("Error in getFollowingCount:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getFollowersCount = async (req: any, res: any) => {
  try {
    const { userId } = req.body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const follower = await Follower.findOne({ userId });
    if (!follower) {
      return res.status(200).json({ followersCount: 0 });
    }

    res.status(200).json({ followersCount: follower.followersList.length });
  } catch (error) {
    console.error("Error in getFollowersCount:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};