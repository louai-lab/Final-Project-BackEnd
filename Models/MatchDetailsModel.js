import mongoose from "mongoose";

const MatchDetailsSchema = new mongoose.Schema({
  details: [
    {
      type: {
        type: String,
        enum: [
          "goal",
          "yellow_card",
          "red_card",
          "substitution",
          "HT",
          "full_time",
          "firstExtraTime",
          "secondExtraTime",
          "penalties",
        ],
      },
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
      playerIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },

      playerOut: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
      minute: {
        type: Number,
      },

      // this field is just for penalties situation
      penalty: {
        type: String,
        enum: ["scored", "missed"],
      },
    },
  ],
});

const MatchDetails = mongoose.model("MatchDetails", MatchDetailsSchema);

export default MatchDetails;
