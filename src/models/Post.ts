import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }, // The text of the post
  image: { type: String }, // Optional image attached to the post
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Post = mongoose.model('Post', postSchema);

