import express from "express";
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  getMatch,
  updateMatch,
} from "../Controllers/MatchControllers.js";
import { auth } from "../middleware/Auth.js";
import { paginate } from "../middleware/Pagination.js";

const matchRoutes = express.Router();

matchRoutes.get("/", paginate , auth, getAllMatches);
matchRoutes.get("/match/:id", getMatch);
matchRoutes.post("/add", createMatch);
matchRoutes.patch("/update/:id", updateMatch);
matchRoutes.delete("/delete/:id", deleteMatch);

export default matchRoutes;
