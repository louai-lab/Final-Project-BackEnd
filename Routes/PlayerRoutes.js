import express from "express";
import {
  addPlayer,
  getAllPlayers,
  updatePlayer,
  deletePlayer,
  getPlayersWithoutTeam,
} from "../Controllers/PlayerControllers.js";
import { paginate } from "../middleware/Pagination.js";

const playerRoutes = express.Router();

playerRoutes.get("/", paginate, getAllPlayers);
playerRoutes.get("/playersnoteam", getPlayersWithoutTeam);
playerRoutes.post("/add", addPlayer);
playerRoutes.patch("/update/:id", updatePlayer);
playerRoutes.delete("/delete/:id", deletePlayer);

export default playerRoutes;
