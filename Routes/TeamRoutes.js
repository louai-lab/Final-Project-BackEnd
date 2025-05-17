import express from "express";
import upload from "../middleware/Multer.js";
import {
  addTeam,
  getAllTeam,
  updateTeam,
  deleteTeam,
  getOneTeam,
} from "../Controllers/TeamControllers.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const teamRoutes = express.Router();

teamRoutes.get("/", getAllTeam);
teamRoutes.get("/team/:id", getOneTeam);
teamRoutes.post("/add", upload.single("image"), ByAdmin, addTeam);
teamRoutes.patch("/update/:id", upload.single("image"), ByAdmin, updateTeam);
teamRoutes.delete("/delete/:id", upload.single("image"), ByAdmin, deleteTeam);

export default teamRoutes;
