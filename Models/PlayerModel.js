import mongoose from "mongoose";
import Team from "./TeamModel.js";

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tShirtNumber: {
      type: Number,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    image: { type: String },
    idCard: {
      type: Number,
    },
    dateOfBirth: {
      type: String,
    },
    motherName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

PlayerSchema.index({ createdAt: -1 });

const Player = mongoose.model("Player", PlayerSchema);

export default Player;
