import mongoose from "mongoose";
import Team from "./TeamModel.js";

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  }
);

PlayerSchema.index({ createdAt: -1 });

const Player = mongoose.model("Player", PlayerSchema);

export default Player;
