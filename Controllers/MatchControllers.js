import User from "../Models/UserModel.js";
import Team from "../Models/TeamModel.js";
import moment from "moment";
import Match from "../Models/MatchModel.js";

// get all matches
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("team_a.team", "name")
      .populate("team_b.team", "name")
      .populate("referee", "firstName lastName role")
      .populate("watcher", "firstName lastName role")
      .exec();

    return res.status(200).json(matches);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// create a Match
export const createMatch = async (req, res) => {
  try {
    const { team_a, team_b, referee, watcher, match_date } = req.body;

    const formattedMatchDate = moment(match_date, "DD/MM/YYYY").toDate();

    // Create a new match
    const newMatch = new Match({
      team_a,
      team_b,
      referee,
      watcher,
      match_date: formattedMatchDate,
    });

    const savedMatch = await newMatch.save();

    res.status(201).json(savedMatch);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// Update a Match
export const updateMatch = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedData = req.body;

    const existingMatch = await Match.findById(id);
    if (!existingMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    const updatedMatch = await Match.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json(updatedMatch);
  } catch (error) {
    console.log(error);
  }
};

// Delete a Match
export const deleteMatch = async (req, res) => {
  const id = req.params.id;
  try {
    const existingMatch = await Match.findById(id);

    if (!existingMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    await Match.findByIdAndDelete(id);

    return res.status(200).json("Match deleted successfuly");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
