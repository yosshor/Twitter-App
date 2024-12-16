import { Request, Response } from "express";
import  User  from "../models/User"; 


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
