import express from "express";
import {
  createMatchDetails,
  getAllMatchDetails,
  updateMatchDetailsWatcher,
  updateMatchDetailsReferee,
  deleteObject,
  updateObject,
} from "../Controllers/MatchDetailsControllers.js";

const matchDetailsRoutes = express.Router();

matchDetailsRoutes.post("/", createMatchDetails);
matchDetailsRoutes.get("/", getAllMatchDetails);
matchDetailsRoutes.patch("/addObjectWatcher/:id", updateMatchDetailsWatcher);
matchDetailsRoutes.patch("/addObjectReferee/:id", updateMatchDetailsReferee);
matchDetailsRoutes.patch("/deleteObject/:matchDetailsId/:id", deleteObject);
matchDetailsRoutes.patch("/updateObject/:matchDetailsId/:id", updateObject);

export default matchDetailsRoutes;
