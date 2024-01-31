import mongoose from "mongoose";
import Player from "./PlayerModel.js";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type:String,
    required:true
  },
  players:[Player.schema]
});

const Team = mongoose.model("Team", TeamSchema);

export default Team;
