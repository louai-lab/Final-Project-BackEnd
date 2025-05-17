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

matchDetailsRoutes.post("/", ByAdmin, Authorized, createMatchDetails);
matchDetailsRoutes.get("/", Authorized, getAllMatchDetails);
matchDetailsRoutes.patch(
  "/addObjectWatcher/:id",
  Authorized,
  ByWatcher,
  updateMatchDetailsWatcher
);
matchDetailsRoutes.patch(
  "/addObjectReferee/:id",
  Authorized,
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
