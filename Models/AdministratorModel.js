import mongoose from "mongoose";

const AdministratorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    characteristic: {
      type: String,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

AdministratorSchema.index({ createdAt: -1 });

const Administrator = mongoose.model("Administrator", AdministratorSchema);

export default Administrator;
