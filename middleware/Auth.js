import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(decoded);
    // console.log(req.user)
    

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
