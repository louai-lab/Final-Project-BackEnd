import express from "express";
import { addPlayer , getAllPlayers , updatePlayer , deletePlayer , getPlayersWithoutTeam} from "../Controllers/PlayerControllers.js";

const playerRoutes = express.Router();

playerRoutes.get('/',getAllPlayers)
playerRoutes.get('/playersnoteam',getPlayersWithoutTeam)
playerRoutes.post('/add',addPlayer)
playerRoutes.patch('/update/:id',updatePlayer)
playerRoutes.delete('/delete/:id',deletePlayer)




export default playerRoutes