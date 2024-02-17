import { text } from "express";
import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    season: {
      type: Number,
      required: true,
    },
    pitch: {
      type: String,
      required: true,
    },
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

    linesman_one: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    linesman_two: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchDetails",
    },

    match_date: Date,
  },
  {
    timestamps: true,
  }
);

MatchSchema.index({ createdAt: -1 });

const Match = mongoose.model("Match", MatchSchema);

export default Match;
