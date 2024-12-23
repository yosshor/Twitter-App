import mongoose, { Schema } from "mongoose";

const followerSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    unique: true,
  },
  followersList: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", 
    },
  ],
});

export const Follower = mongoose.model("Follower", followerSchema);
