import mongoose from "mongoose";

const MatchDetailsSchema = new mongoose.Schema({
  details: [
    {
      type: {
        type: String,
        enum: ["goal", "yellow_card", "red_card", "substitution"],
        required: true,
      },
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
      playerIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },

      playerOut: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },

      minute: {
        type: Number,
        required: true,
      },
    },
  ],
});

const MatchDetails = mongoose.model("MatchDetails", MatchDetailsSchema);

export default MatchDetails;
