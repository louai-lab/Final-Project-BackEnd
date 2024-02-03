import mongoose from "mongoose";
import Player from "./PlayerModel.js";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
});

const Team = mongoose.model("Team", TeamSchema);

export default Team;

// import mongoose from "mongoose";
// import Player from "./PlayerModel.js";

// const TeamSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type:String,
//     required:true
//   },
//   players:[Player.schema]
// });

// const Team = mongoose.model("Team", TeamSchema);

// export default Team;
