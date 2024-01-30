import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = decoded;
    console.log(decoded);

    if (req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied. you have no permission" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
