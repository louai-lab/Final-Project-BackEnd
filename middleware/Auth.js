import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../Models/UserModel.js";

export const auth = async (req, res, next) => {
  const token = req.cookies.access_token;

  // if (!token) {
  //   return res.status(401).json({ error: "Unauthorized - Missing token" });
  // }

  if (!token) {
    // console.log("Missing token");
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    // if (!user) {
    //   return res.status(401).json({ error: "Unauthorized - User not found" });
    // }

    if (!user) {
      // console.log("User not found");
      return next();
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
