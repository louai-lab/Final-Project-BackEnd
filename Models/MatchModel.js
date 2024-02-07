import { text } from "express";
import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  team_a: {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    score: { type: Number, default: 0 },
  },
  team_b: {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    score: { type: Number, default: 0 },
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  referee_report: { type: String },

  watcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  watcher_report: { type: String },
  details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchDetails",
    },
  ],

  match_date: Date,
});

const Match = mongoose.model("Match", MatchSchema);

export default Match;
