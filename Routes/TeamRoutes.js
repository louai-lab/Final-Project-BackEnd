import express from "express";
import upload from "../middleware/Multer.js";
import {
  addTeam,
  getAllTeam,
  updateTeam,
  deleteTeam,
  deletePlayerFromTeam,
  addPlayersToTeam,
} from "../Controllers/TeamControllers.js";

const teamRoutes = express.Router();

teamRoutes.get("/", getAllTeam);
teamRoutes.post("/add", upload.single("image"), addTeam);
teamRoutes.patch("/update/:id", upload.single("image"), updateTeam);
teamRoutes.delete("/delete/:id", upload.single("image"), deleteTeam);

teamRoutes.delete(
  "/deletePlayerFromTeam/:idTeam/:idPlayer",
  deletePlayerFromTeam
);
teamRoutes.post('/addPlayersToTeam',addPlayersToTeam)

export default teamRoutes;
