import express from "express";
import upload from "../middleware/Multer.js";
import {
  addTeam,
  getAllTeam,
  updateTeam,
  deleteTeam,
  getOneTeam,
} from "../Controllers/TeamControllers.js";

const teamRoutes = express.Router();

teamRoutes.get("/", getAllTeam);
teamRoutes.get("/team/:id", getOneTeam);
teamRoutes.post("/add", upload.single("image"), addTeam);
teamRoutes.patch("/update/:id", upload.single("image"), updateTeam);
teamRoutes.delete("/delete/:id", upload.single("image"), deleteTeam);

export default teamRoutes;
