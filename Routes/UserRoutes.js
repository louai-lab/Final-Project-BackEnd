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

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);

userRoutes.get("/oneuser", getOneUser);
userRoutes.get("/referees", getAllReferees);
userRoutes.get("/watchers", getAllWatchers);
userRoutes.get("/linesman", getAllLinesman);
userRoutes.post("/add", upload.single("image"), addUser);
userRoutes.patch("/update", upload.single("image"), updateUser);
userRoutes.patch("/updateNoCheck", upload.single("image"), updateUserNoCheck);
userRoutes.delete("/delete/:id", upload.single("image"), deleteUser);
userRoutes.post("/", upload.single("image"), resgister);
userRoutes.get("/logged-in-user", auth, loggedInUser);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);

export default userRoutes;
