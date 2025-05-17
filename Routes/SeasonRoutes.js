import express from "express";
import {
  createSeason,
  getAllSeasons,
  updateSeason,
  deleteSeason,
} from "../Controllers/SeasonControllers.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const seasonRoutes = express.Router();

seasonRoutes.get("/", ByAdmin, getAllSeasons);
seasonRoutes.post("/add", ByAdmin, createSeason);
seasonRoutes.patch("/update/:id", ByAdmin, updateSeason);
seasonRoutes.delete("/delete/:id", ByAdmin, deleteSeason);

export default seasonRoutes;
