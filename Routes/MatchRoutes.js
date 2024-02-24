import express from "express";
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  getLastCreatedMatch,
  getLastCreatedMatchByWatcher,
  getLastCreatedMatchByReferee,
  getAllMatchesByWatcher,
  getAllMatchesByReferee,
  getMatch,
  updateMatch,
} from "../Controllers/MatchControllers.js";
import { auth } from "../middleware/Auth.js";

const matchRoutes = express.Router();

matchRoutes.get("/", getAllMatches);
matchRoutes.get("/getlastcreatedmatch", getLastCreatedMatch);
matchRoutes.get('/getlastcreatedmatchbywatcher' ,auth, getLastCreatedMatchByWatcher)
matchRoutes.get('/getlastcreatedmatchbyreferee' ,auth, getLastCreatedMatchByReferee)
matchRoutes.get("/matchesbywatcher", auth , getAllMatchesByWatcher);
matchRoutes.get("/matchesbyreferee", auth , getAllMatchesByReferee);
matchRoutes.get("/match/:id", getMatch);
matchRoutes.post("/add", createMatch);
matchRoutes.patch("/update/:id", updateMatch);
matchRoutes.delete("/delete/:id", deleteMatch);

export default matchRoutes;
