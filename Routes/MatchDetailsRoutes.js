import express from "express";
import { createMatchDetails , getAllMatchDetails , updateMatchDetails , deleteObject} from "../Controllers/MatchDetailsControllers.js";

const matchDetailsRoutes = express.Router();

matchDetailsRoutes.post("/", createMatchDetails);
matchDetailsRoutes.get('/',getAllMatchDetails)
matchDetailsRoutes.patch('/update/:id', updateMatchDetails)
matchDetailsRoutes.patch('/deleteObject/:matchId/:id', deleteObject)


export default matchDetailsRoutes;
