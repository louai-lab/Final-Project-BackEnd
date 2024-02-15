import mongoose from "mongoose";
import Player from "./PlayerModel.js";

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", TeamSchema);

export default Team;
