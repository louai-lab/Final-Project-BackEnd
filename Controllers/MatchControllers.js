import moment from "moment-timezone";
import Match from "../Models/MatchModel.js";
import MatchDetails from "../Models/MatchDetailsModel.js";

// Get All Matches
// export const getAllMatches = async (req, res) => {
//   try {
//     const matches = await Match.find()
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "team_a.team",
//         select: "name image",
//         populate: {
//           path: "players",
//           select: "name",
//         },
//       })
//       .populate({
//         path: "team_b.team",
//         select: "name image",
//         populate: {
//           path: "players",
//           select: "name",
//         },
//       })
//       .populate("referee", "firstName lastName role image")
//       .populate("watcher", "firstName lastName role image")
//       .populate("linesman_one", "firstName lastName role")
//       .populate("linesman_two", "firstName lastName role")
//       .populate({
//         path: "details",
//         populate: {
//           path: "details.team details.playerIn details.playerOut",
//           select: "name",
//         },
//       })
//       .lean()
//       .exec();

//     if (!matches) {
//       return res.status(404).json({ message: "No matches found" });
//     }

//     matches.forEach((match) => {
//       let teamAScore = 0;
//       let teamBScore = 0;

//       if (match.details && match.details.details) {
//         const events = match.details.details;

//         events.forEach((event) => {
//           if (event.type === "goal" && event.team) {
//             const scoringTeam =
//               event.team.name === match.team_a.team.name ? "team_a" : "team_b";
//             if (scoringTeam === "team_a") {
//               teamAScore += 1;
//             } else {
//               teamBScore += 1;
//             }
//           }
//         });
//       }

//       match.team_a.score = teamAScore;
//       match.team_b.score = teamBScore;
//     });

//     return res.status(200).json(matches);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server Error");
//   }
// };

export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .lean()
      .exec();

    if (!matches) {
      return res.status(404).json({ message: "No matches found" });
    }

    for (const match of matches) {
      let teamAScore = 0;
      let teamBScore = 0;

      if (match.details && match.details.details) {
        const events = match.details.details;

        events.forEach((event) => {
          if (event.type === "goal" && event.team) {
            const scoringTeam =
              event.team.name === match.team_a.team.name ? "team_a" : "team_b";
            if (scoringTeam === "team_a") {
              teamAScore += 1;
            } else {
              teamBScore += 1;
            }
          }
        });

        // Update the played field based on details
        if (events.length > 0) {
          await Match.findByIdAndUpdate(match._id, { played: true });
        } else {
          await Match.findByIdAndUpdate(match._id, { played: false });
        }
      }

      match.team_a.score = teamAScore;
      match.team_b.score = teamBScore;
    }

    return res.status(200).json(matches);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Get the Last Created Match
export const getLastCreatedMatch = async (req, res) => {
  try {
    const lastMatch = await Match.findOne()
      .sort({ createdAt: -1 })
      // .populate("team_a.team", "name image")
      // .populate("team_b.team", "name image")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .lean()
      .exec();

    if (!lastMatch) {
      return res.status(404).json({ message: "No matches found" });
    }

    // Calculate scores if details are available
    if (lastMatch.details && lastMatch.details.details) {
      const events = lastMatch.details.details;

      // Initialize scores
      let teamAScore = 0;
      let teamBScore = 0;

      // Iterate through details and calculate scores
      events.forEach((event) => {
        if (event.type === "goal" && event.team) {
          const scoringTeam =
            event.team.name === lastMatch.team_a.team.name
              ? "team_a"
              : "team_b";
          if (scoringTeam === "team_a") {
            teamAScore += 1;
          } else {
            teamBScore += 1;
          }
        }
      });

      // Update the scores in the response
      lastMatch.team_a.score = teamAScore;
      lastMatch.team_b.score = teamBScore;
    }

    return res.status(200).json(lastMatch);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Get the Last Created Match by Watcher
export const getLastCreatedMatchByWatcher = async (req, res) => {
  const id = req.user?.userId;
  try {
    const lastMatch = await Match.findOne({ watcher: id })
      .sort({ createdAt: -1 })
      // .populate("team_a.team", "name image")
      // .populate("team_b.team", "name image")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .lean()
      .exec();

    if (!lastMatch) {
      return res
        .status(404)
        .json({ message: "No matches found for the specified watcher" });
    }

    if (lastMatch.details && lastMatch.details.details) {
      const events = lastMatch.details.details;

      let teamAScore = 0;
      let teamBScore = 0;

      events.forEach((event) => {
        if (event.type === "goal" && event.team) {
          const scoringTeam =
            event.team.name === lastMatch.team_a.team.name
              ? "team_a"
              : "team_b";
          if (scoringTeam === "team_a") {
            teamAScore += 1;
          } else {
            teamBScore += 1;
          }
        }
      });

      lastMatch.team_a.score = teamAScore;
      lastMatch.team_b.score = teamBScore;
    }

    // console.log(lastMatch)
    return res.status(200).json(lastMatch);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Get the Last Created Match by Referee
export const getLastCreatedMatchByReferee = async (req, res) => {
  const id = req.user?.userId;
  try {
    const lastMatch = await Match.findOne({ referee: id })
      .sort({ createdAt: -1 })
      // .populate("team_a.team", "name image")
      // .populate("team_b.team", "name image")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .lean()
      .exec();

    if (!lastMatch) {
      return res
        .status(404)
        .json({ message: "No matches found for the specified referee" });
    }

    if (lastMatch.details && lastMatch.details.details) {
      const events = lastMatch.details.details;

      let teamAScore = 0;
      let teamBScore = 0;

      events.forEach((event) => {
        if (event.type === "goal" && event.team) {
          const scoringTeam =
            event.team.name === lastMatch.team_a.team.name
              ? "team_a"
              : "team_b";
          if (scoringTeam === "team_a") {
            teamAScore += 1;
          } else {
            teamBScore += 1;
          }
        }
      });

      lastMatch.team_a.score = teamAScore;
      lastMatch.team_b.score = teamBScore;
    }

    // console.log(lastMatch)
    return res.status(200).json(lastMatch);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Get All Matches by a specific watcher
export const getAllMatchesByWatcher = async (req, res) => {
  // const id = req.params.id;
  const id = req.user?.userId;

  try {
    const matches = await Match.find({ watcher: id })
      .sort({ createdAt: -1 })
      // .populate("team_a.team", "name image")
      // .populate("team_b.team", "name image")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
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

      // Check if match.details is an object
      if (match.details && match.details.details) {
        const events = match.details.details;

        // Iterate through details and calculate scores
        events.forEach((event) => {
          if (event.type === "goal" && event.team) {
            const scoringTeam =
              event.team.name === match.team_a.team.name ? "team_a" : "team_b";
            if (scoringTeam === "team_a") {
              teamAScore += 1;
            } else {
              teamBScore += 1;
            }
          }
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

// Get All Matches by a specific referee
export const getAllMatchesByReferee = async (req, res) => {
  // const id = req.params.id;

  const id = req.user?.userId;

  try {
    const matches = await Match.find({ referee: id })
      .sort({ createdAt: -1 })
      // .populate("team_a.team", "name image")
      // .populate("team_b.team", "name image")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
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

    matches.forEach((match) => {
      let teamAScore = 0;
      let teamBScore = 0;

      if (match.details && match.details.details) {
        const events = match.details.details;

        events.forEach((event) => {
          if (event.type === "goal" && event.team) {
            const scoringTeam =
              event.team.name === match.team_a.team.name ? "team_a" : "team_b";
            if (scoringTeam === "team_a") {
              teamAScore += 1;
            } else {
              teamBScore += 1;
            }
          }
        });
      }

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
      // .populate("team_a.team", "name")
      // .populate("team_b.team", "name")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
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

    if (
      match.details &&
      match.details.details &&
      match.details.details.length > 0
    ) {
      await Match.findByIdAndUpdate(id, { played: true });
    } else {
      await Match.findByIdAndUpdate(id, { played: false });
    }

    let teamAScore = 0;
    let teamBScore = 0;

    if (match.details && match.details.details) {
      const events = match.details.details;

      events.forEach((event) => {
        if (event.type === "goal" && event.team) {
          const scoringTeam =
            event.team.name === match.team_a.team.name ? "team_a" : "team_b";
          if (scoringTeam === "team_a") {
            teamAScore += 1;
          } else {
            teamBScore += 1;
          }
        }
      });
    }

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
    const {
      title,
      season,
      pitch,
      team_a,
      team_b,
      referee,
      watcher,
      details,
      linesman_one,
      linesman_two,
      match_date,
      match_time,
      time_zone,
    } = req.body;
    // console.log(req.body)

    const combinedDateTime = `${match_date} ${match_time}`;

    const formattedMatchDateTime = moment
      .tz(combinedDateTime, "YYYY/MM/DD h:mm A", time_zone)
      .toDate();

    // Create a new match
    const newMatch = new Match({
      title,
      season,
      pitch,
      team_a,
      team_b,
      referee,
      watcher,
      linesman_one,
      linesman_two,
      match_date: formattedMatchDateTime,
    });

    const savedMatch = await newMatch.save();

    const newMatchDetails = new MatchDetails({
      details,
    });

    const savedMatchDetails = await newMatchDetails.save();

    savedMatch.details = savedMatchDetails._id;
    await savedMatch.save();

    // res.status(201).json(savedMatch);

    // Populate multiple fields
    const populatedMatch = await Match.findById(savedMatch._id)
      // .populate("team_a.team", "name")
      // .populate("team_b.team", "name")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .exec();

    res.status(201).json(populatedMatch);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// Update a Match
export const updateMatch = async (req, res) => {
  const id = req.params.id;
  try {
    const { match_date, match_time, time_zone, ...otherUpdatedData } = req.body;

    const existingMatch = await Match.findById(id);
    if (!existingMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match_date) {
      existingMatch.match_date = moment.tz(match_date, "MM/DD/YYYY").toDate();
    }

    if (match_time) {
      existingMatch.match_date = moment
        .tz(`${match_date} ${match_time}`, "MM/DD/YYYY h:mm A")
        .toDate();
    }

    // Update other fields
    Object.assign(existingMatch, otherUpdatedData);

    const updatedMatch = await existingMatch.save();

    const populatedMatch = await Match.findById(updatedMatch._id)
      // .populate("team_a.team", "name")
      // .populate("team_b.team", "name")
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
      .populate({
        path: "details",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name",
        },
      })
      .exec();

    return res.status(200).json(populatedMatch);
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
