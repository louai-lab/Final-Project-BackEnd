import express from "express";
import {
  createMatchDetails,
  getAllMatchDetails,
  updateMatchDetailsWatcher,
  updateMatchDetailsReferee,
  deleteObject,
  updateObject,
} from "../Controllers/MatchDetailsControllers.js";
import { Authorized } from "../middleware/Authorized.js";
import { ByReferee } from "../middleware/ByReferee.js";
import { ByWatcher } from "../middleware/ByWatcher.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const matchDetailsRoutes = express.Router();

matchDetailsRoutes.post("/", ByAdmin, createMatchDetails);
matchDetailsRoutes.get("/", getAllMatchDetails);
matchDetailsRoutes.patch(
  "/addObjectWatcher/:id/:userId/:matchId",
  ByWatcher,
  updateMatchDetailsWatcher
);
matchDetailsRoutes.patch(
  "/addObjectReferee/:id/:userId/:matchId",
  ByReferee,
  updateMatchDetailsReferee
);
matchDetailsRoutes.patch(
  "/deleteObject/:matchDetailsId/:id",
  Authorized,
  deleteObject
);
matchDetailsRoutes.patch(
  "/updateObject/:matchDetailsId/:id",
  Authorized,
  updateObject
);

export default matchDetailsRoutes;
