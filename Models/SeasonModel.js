import mongoose from "mongoose";

const SeasonSchema = new mongoose.Schema(
  {
    seasonName: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{4}\/\d{4}$/,
    },
  },
  {
    timestamps: true,
  }
);

SeasonSchema.index({ createdAt: -1 });

const Season = mongoose.model("Season", SeasonSchema);

export default Season;
