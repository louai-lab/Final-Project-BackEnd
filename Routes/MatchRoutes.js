import express from "express";
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  // getLastCreatedMatch,
  getLastTwoCreatedMatches,
  getMatch,
  updateMatch,
} from "../Controllers/MatchControllers.js";
import { auth } from "../middleware/Auth.js";
import { paginate } from "../middleware/Pagination.js";

const matchRoutes = express.Router();

matchRoutes.get("/", paginate , auth, getAllMatches);
// matchRoutes.get("/getlastcreatedmatch", auth, getLastCreatedMatch);
matchRoutes.get("/getLastTwoCreatedMatches", auth, getLastTwoCreatedMatches);
matchRoutes.get("/match/:id", getMatch);
matchRoutes.post("/add", createMatch);
matchRoutes.patch("/update/:id", updateMatch);
matchRoutes.delete("/delete/:id", deleteMatch);

export default matchRoutes;
