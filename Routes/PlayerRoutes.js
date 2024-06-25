import express from "express";
import {
  addPlayer,
  getAllPlayers,
  updatePlayer,
  deletePlayer,
  getPlayersWithoutTeam,
} from "../Controllers/PlayerControllers.js";
import { paginate } from "../middleware/Pagination.js";
import upload from "../middleware/Multer.js";

const playerRoutes = express.Router();

playerRoutes.get("/", paginate, getAllPlayers);
playerRoutes.get("/playersnoteam", getPlayersWithoutTeam);
playerRoutes.post("/add", upload.single("image"), addPlayer);
playerRoutes.patch("/update/:id", upload.single("image"), updatePlayer);
playerRoutes.delete("/delete/:id", upload.single("image"), deletePlayer);

export default playerRoutes;
