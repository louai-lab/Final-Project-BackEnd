import express from "express";
import upload from "../middleware/Multer.js";
import { resgister, login , logout , getAllUsers , addUser } from "../Controllers/UsersControllers.js";

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);
userRoutes.post('/add',upload.single('image'),addUser)
userRoutes.post("/", upload.single("image"), resgister);
userRoutes.post('/login',login)
userRoutes.get('/logout',logout)


export default userRoutes;
