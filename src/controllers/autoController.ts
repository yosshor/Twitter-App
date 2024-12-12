import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt1 from "jwt-simple";
import jwt from "jsonwebtoken";

const secret = (): string => {
  return process.env.SECRET as string;
};

const cookieName = "userTwitter";

export const register = async (req: any, res: any) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const profilePicture = req.file ? req.file.path : null;
    console.log(profilePicture, username, email, password, firstName, lastName);

    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).send({ error: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password: password,
      firstName,
      lastName,
      profilePicture,
    });

    //jwt
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
      role: "User",
    };

    const payloadJWT = jwt1.encode(payload, secret());
    console.log(payloadJWT);

    await user.save();
    res.cookie(cookieName, payloadJWT, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // Set to true in production with HTTPS
      sameSite: "none", // Required for cross-origin requests
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET!, {
      expiresIn: "12h",
    });
    console.log("Token generated:", token);
    res.json({ token: token, jwtToken: payloadJWT });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export async function login(req: any, res: any): Promise<void> {
  try {
    const userToken =
      req.headers.authorization?.split(" ")[1] || req.cookies.userTwitter;
    console.log("Token:", userToken);
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password.trim()
    );

    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    //jwt
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
      role: "User",
    };
    const payloadJWT = jwt1.encode(payload, secret());
    console.log(payloadJWT);

    res.cookie(cookieName, payloadJWT, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // Set to true in production with HTTPS
      sameSite: "none", // Required for cross-origin requests
    });
    const token = jwt.sign({ id: user._id }, process.env.SECRET!, {
      expiresIn: "12h",
    });
    console.log("Token generated:", token);
    res.json({ token: token, jwtToken: payloadJWT });
  } catch (err: any) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
