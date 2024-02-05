import express from "express";
import { createMatch , deleteMatch , getAllMatches , updateMatch} from "../Controllers/MatchControllers.js";

const matchRoutes = express.Router();

matchRoutes.get('/',getAllMatches)
matchRoutes.post('/add',createMatch)
matchRoutes.patch('/update/:id',updateMatch)
matchRoutes.delete('/delete/:id',deleteMatch)



export default matchRoutes