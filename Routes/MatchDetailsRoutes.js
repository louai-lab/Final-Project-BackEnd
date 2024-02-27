import express from "express";
import {
  createMatchDetails,
  getAllMatchDetails,
  updateMatchDetails,
  deleteObject,
  updateObject,
} from "../Controllers/MatchDetailsControllers.js";

const matchDetailsRoutes = express.Router();

matchDetailsRoutes.post("/", createMatchDetails);
matchDetailsRoutes.get("/", getAllMatchDetails);
matchDetailsRoutes.patch("/addObject/:id", updateMatchDetails);
matchDetailsRoutes.patch("/deleteObject/:matchDetailsId/:id", deleteObject);
matchDetailsRoutes.patch("/updateObject/:matchDetailsId/:id", updateObject);

export default matchDetailsRoutes;
