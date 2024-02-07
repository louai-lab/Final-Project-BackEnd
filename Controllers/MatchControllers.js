import moment from "moment";
import Match from "../Models/MatchModel.js";
import MatchDetails from "../Models/MatchDetailsModel.js";

// Get All Matches
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("team_a.team", "name")
      .populate("team_b.team", "name")
      .populate("referee", "firstName lastName role")
      .populate("watcher", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          // path: "details.team details.player",
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .lean()
      .exec();

      if (!matches) {
        return res.status(404).json({ message: "No matches found" });
      }


      // Iterate through matches and calculate scores
    matches.forEach((match) => {
      // Initialize scores
      let teamAScore = 0;
      let teamBScore = 0;

      // Check if match.details is an array
      if (Array.isArray(match.details)) {
        // Iterate through details and calculate scores
        match.details.forEach((detail) => {
          const goals = detail.details.filter((goal) => goal.type === "goal");
          goals.forEach((goal) => {
            const scoringTeam = goal.team.name === match.team_a.team.name ? "team_a" : "team_b";
            if (scoringTeam === "team_a") {
              teamAScore += 1;
            } else {
              teamBScore += 1;
            }
          });
        });
      }

      // Update the scores in the response
      match.team_a.score = teamAScore;
      match.team_b.score = teamBScore;
    });

    return res.status(200).json(matches);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Get a Match
export const getMatch = async (req, res) => {
  const id = req.params.id;
  try {
    const match = await Match.findById(id)
      .populate("team_a.team", "name")
      .populate("team_b.team", "name")
      .populate("referee", "firstName lastName role")
      .populate("watcher", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .lean()
      .exec();

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

     // Initialize scores
     let teamAScore = 0;
     let teamBScore = 0;
 
     // Iterate through details and calculate scores
     match.details.forEach((detail) => {
       const goals = detail.details.filter((goal) => goal.type === "goal");
       goals.forEach((goal) => {
         const scoringTeam = goal.team.name === match.team_a.team.name ? "team_a" : "team_b";
         if (scoringTeam === "team_a") {
           teamAScore += 1;
         } else {
           teamBScore += 1;
         }
       });
     });
 
     // Update the scores in the response
     match.team_a.score = teamAScore;
     match.team_b.score = teamBScore;

    

    return res.status(200).json(match);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// create a Match && by default it will create a MatchDetails
// and included in the match body to be able to use matchDetails Id
// and use it in case of adding an object of details
// inside the array of details
export const createMatch = async (req, res) => {
  try {
    const { team_a, team_b, referee, watcher, match_date, details } = req.body;

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

    const newMatchDetails = new MatchDetails({
      details,
    });

    const savedMatchDetails = await newMatchDetails.save();

    savedMatch.details.push(savedMatchDetails._id);
    await savedMatch.save();

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
    return res.status(500).send("Internal Server Error");
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
