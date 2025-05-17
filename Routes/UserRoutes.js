import express from "express";
import upload from "../middleware/Multer.js";
import { auth } from "../middleware/Auth.js";
import {
  resgister,
  login,
  logout,
  getAllUsers,
  getOneUser,
  addUser,
  updateUser,
  updateUserNoCheck,
  deleteUser,
  loggedInUser,
  getAllReferees,
  getAllWatchers,
  getAllLinesman,
} from "../Controllers/UsersControllers.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const userRoutes = express.Router();

userRoutes.get("/", ByAdmin, getAllUsers);

userRoutes.get("/oneuser", getOneUser);
userRoutes.get("/referees", ByAdmin, getAllReferees);
userRoutes.get("/watchers", ByAdmin, getAllWatchers);
userRoutes.get("/linesman", ByAdmin, getAllLinesman);
userRoutes.post("/add", ByAdmin, upload.single("image"), addUser);
userRoutes.patch("/update", auth, upload.single("image"), updateUser);
userRoutes.patch(
  "/updateNoCheck",
  ByAdmin,
  upload.single("image"),
  updateUserNoCheck
);
userRoutes.delete("/delete/:id", ByAdmin, upload.single("image"), deleteUser);
userRoutes.post("/", upload.single("image"), resgister);
userRoutes.get("/logged-in-user", auth, loggedInUser);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);

export default userRoutes;
