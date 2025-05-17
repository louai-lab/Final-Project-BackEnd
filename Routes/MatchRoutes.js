import express from "express";
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  getMatch,
  updateMatch,
} from "../Controllers/MatchControllers.js";
import { ByAdmin } from "../middleware/ByAdmin.js";
import { paginate } from "../middleware/Pagination.js";

const matchRoutes = express.Router();

matchRoutes.get("/", paginate, getAllMatches);
matchRoutes.get("/match/:id", getMatch);
matchRoutes.post("/add", ByAdmin, createMatch);
matchRoutes.patch("/update/:id", ByAdmin, updateMatch);
matchRoutes.delete("/delete/:id", ByAdmin, deleteMatch);

export default matchRoutes;
