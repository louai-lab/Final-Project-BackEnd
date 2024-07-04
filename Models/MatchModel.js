import { text } from "express";
import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Title",
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
    },
    pitch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pitch",
    },
    team_a: {
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      scoreWatcher: { type: Number, default: 0 },
      scoreHTWatcher: { type: Number, default: 0 },
      scorePenaltiesWatcher: { type: Number, default: 0 },
      scoreReferee: { type: Number, default: 0 },
      scoreHTReferee: { type: Number, default: 0 },
      scorePenaltiesReferee: { type: Number, default: 0 },
    },
    team_b: {
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      scoreWatcher: { type: Number, default: 0 },
      scoreHTWatcher: { type: Number, default: 0 },
      scorePenaltiesWatcher: { type: Number, default: 0 },
      scoreReferee: { type: Number, default: 0 },
      scoreHTReferee: { type: Number, default: 0 },
      scorePenaltiesReferee: { type: Number, default: 0 },
    },
    startersTeamA: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    substitutesTeamA: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    administratorsTeamA: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Administrator",
      },
    ],
    startersTeamB: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    substitutesTeamB: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    administratorsTeamB: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Administrator",
      },
    ],
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
    detailsReferee: {
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
