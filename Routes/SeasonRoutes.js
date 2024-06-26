import express from "express";
import {
  createSeason,
  getAllSeasons,
  updateSeason,
  deleteSeason,
} from "../Controllers/SeasonControllers.js";

const seasonRoutes = express.Router();

seasonRoutes.get("/", getAllSeasons);
seasonRoutes.post("/add", createSeason);
seasonRoutes.patch("/update/:id", updateSeason);
seasonRoutes.delete("/delete/:id", deleteSeason);

export default seasonRoutes;
