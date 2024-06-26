import { text } from "express";
import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Title",
    },
    // title: {
    //   type: String,
    //   required: true,
    // },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
    },
    // season: {
    //   type: Number,
    //   required: true,
    // },
    pitch: {
      type: String,
      required: true,
    },
    team_a: {
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      score: { type: Number, default: 0 },
      scoreHT: { type: Number, default: 0 },
      scorePenalties: { type: Number, default: 0 },
    },
    team_b: {
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      score: { type: Number, default: 0 },
      scoreHT: { type: Number, default: 0 },
      scorePenalties: { type: Number, default: 0 },
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

    reported: { type: Boolean, default: false },

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

    detailsWatcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchDetails",
    },
    played: {
      type: Boolean,
      default: false,
    },

    match_date: {
      type: Date,
      required: true,
    },
    match_time: {
      type: String,
      required: true,
    },
    // isFullTime: {
    //   type: Boolean,
    //   default: false,
    // },
    // isFirstExtraTime: {
    //   type: Boolean,
    //   default: false,
    // },
    // isSecondExtraTime: {
    //   type: Boolean,
    //   default: false,
    // },
    isPenalties: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MatchSchema.index({ createdAt: -1 });

const Match = mongoose.model("Match", MatchSchema);

export default Match;
