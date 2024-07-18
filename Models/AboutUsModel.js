import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    facebook: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AboutUs = mongoose.model("AboutUs", AboutUsSchema);

export default AboutUs;
