import mongoose from "mongoose";

const MatchDetailsSchema = new mongoose.Schema({
  // report: {
  //   type: String,
  // },
  details: [
    {
      type: {
        type: String,
        enum: ["goal", "yellow_card", "red_card", "substitution", "HT"],
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
    },
  ],
});

const MatchDetails = mongoose.model("MatchDetails", MatchDetailsSchema);

export default MatchDetails;
