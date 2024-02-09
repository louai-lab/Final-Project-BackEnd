import express from "express";
import { createMatch , deleteMatch , getAllMatches , getAllMatchesByWatcher , getAllMatchesByReferee ,getMatch , updateMatch} from "../Controllers/MatchControllers.js";

const matchRoutes = express.Router();

matchRoutes.get('/',getAllMatches)
matchRoutes.get('/matchesbywatcher/:id',getAllMatchesByWatcher)
matchRoutes.get('/matchesbyreferee/:id',getAllMatchesByReferee)
matchRoutes.get('/match/:id',getMatch)
matchRoutes.post('/add',createMatch)
matchRoutes.patch('/update/:id',updateMatch)
matchRoutes.delete('/delete/:id',deleteMatch)



export default matchRoutes