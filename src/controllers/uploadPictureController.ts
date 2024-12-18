import path from "path";
import multer from "multer";
import User from "../models/User";
import jwt from "jwt-simple";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/users/");
  },
  filename: (req: any, file: any, cb: any) => {
    const { userId, userData } = getUserIdAndData(req);
    cb(null, `${userId}${path.extname(file.originalname)}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Controller to handle profile picture upload
export const uploadProfilePicture = [
  upload.single("profilePicture"),
  async (req: any, res: any) => {
    try {
      console.log("uploading image file");
      const { userId, userData } = getUserIdAndData(req);
      console.log("user id:", userId, "user data:", userData);
      const user = await User.findById(userId);
      if (user) {
        user.profileImage = req.file.path;
        await user.save();
        console.log("successfully upload and save path into user details");
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
];

// Function to get user id and data from the request
export function getUserIdAndData(req: any): {
  userId: string;
  userData: string;
} {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const secret = process.env.SECRET!;

  // Try decoding without verifying first
  const decoded = jwt.decode(token, secret, true); // true verifies signature
  const userId = decoded.userId;
  return { userId: userId, userData: decoded };
  } catch (error) {
    console.error("Error getting user id and data:", error);
    return { userId: "", userData: "" };
  }
}
