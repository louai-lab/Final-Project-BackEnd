import jwt from "jsonwebtoken";

export const ByWatcher = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "watcher") {
      return res.status(404).json({ message: "You are not watcher" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
