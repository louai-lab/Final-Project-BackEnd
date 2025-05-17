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
import { ByAdmin } from "../middleware/ByAdmin.js";

const playerRoutes = express.Router();

playerRoutes.get("/", ByAdmin, paginate, getAllPlayers);
playerRoutes.get("/playersnoteam", ByAdmin, getPlayersWithoutTeam);
playerRoutes.post("/add", ByAdmin, upload.single("image"), addPlayer);
playerRoutes.patch(
  "/update/:id",
  ByAdmin,
  upload.single("image"),
  updatePlayer
);
playerRoutes.delete(
  "/delete/:id",
  ByAdmin,
  upload.single("image"),
  deletePlayer
);

export default playerRoutes;
