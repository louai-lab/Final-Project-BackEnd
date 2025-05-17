import jwt from "jsonwebtoken";

export const ByReferee = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "referee") {
      return res.status(404).json({ message: "You are not referee" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
