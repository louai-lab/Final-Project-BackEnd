import moment from "moment-timezone";
import Match from "../Models/MatchModel.js";
import MatchDetails from "../Models/MatchDetailsModel.js";
import mongoose from "mongoose";

// Get All Matches
export const getAllMatches = async (req, res) => {
  try {
    const userId = req.user?._id;
    const teamId = req.query?.teamId;
    const titleId = req.query?.titleId;
    const seasonId = req.query?.seasonId;
    const pitchId = req.query?.pitchId;

    // console.log(titleId);

    let matches;

    if (req.user?.role === "watcher") {
      matches = await Match.find({ watcher: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "team_a.team",
          select: "name image",
          populate: [
            {
              path: "players",
              select: "name image tShirtNumber idCard dateOfBirth motherName",
            },
            {
              path: "administrators",
              select: "name image characteristic",
            },
          ],
        })
        .populate({
          path: "team_b.team",
          select: "name image",
          populate: [
            {
              path: "players",
              select: "name image tShirtNumber idCard dateOfBirth motherName",
            },
            {
              path: "administrators",
              select: "name image characteristic",
            },
          ],
        })
        .populate("referee", "firstName lastName role image")
        .populate("watcher", "firstName lastName role image")
        .populate("linesman_one", "firstName lastName role image")
        .populate("linesman_two", "firstName lastName role image")
        .populate("title", "name image")
        .populate("season", "seasonName")
        .populate("pitch", "name location image")
        .populate(
          "startersTeamA",
          "name image tShirtNumber idCard dateOfBirth motherName"
        )
        .populate(
          "substitutesTeamA",
          "name image tShirtNumber idCard dateOfBirth motherName"
        )
        .populate("administratorsTeamA", "name image characteristic")
        .populate(
          "startersTeamB",
          "name image tShirtNumber idCard dateOfBirth motherName"
        )
        .populate(
          "substitutesTeamB",
          "name image tShirtNumber idCard dateOfBirth motherName"
        )
        .populate("administratorsTeamB", "name image characteristic")
        .populate({
          path: "detailsWatcher",
          populate: {
            path: "details.team details.playerIn details.playerOut",
            select: "name image",
          },
        })
        .lean()
        .exec();
    } else if (req.user?.role === "referee") {
      matches = await Match.find({ referee: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "team_a.team",
          select: "name image",
          populate: {
            path: "players",
            select: "name image tShirtNumber idCard dateOfBirth motherName",
          },
        })
        .populate({
          path: "team_b.team",
          select: "name image",
          populate: {
            path: "players",
            select: "name image tShirtNumber idCard dateOfBirth motherName",
          },
        })
        .populate("referee", "firstName lastName role image")
        .populate("watcher", "firstName lastName role image")
        .populate("linesman_one", "firstName lastName role image")
        .populate("linesman_two", "firstName lastName role image")
        .populate("title", "name image")
        .populate("season", "seasonName")
        .populate("pitch", "name location image")
        .populate(
          "startersTeamA",
          "name image tShirtNumber idCard dateOfBirth motherName"
        )
        .populate({
          path: "detailsWatcher",
          populate: {
            path: "details.team details.playerIn details.playerOut",
            select: "name image",
          },
        })
        .lean()
        .exec();
    } else {
      matches = await Match.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "team_a.team",
          select: "name image",
          populate: {
            path: "players",
            select: "name image tShirtNumber idCard dateOfBirth motherName",
          },
        })
        .populate({
          path: "team_b.team",
          select: "name image",
          populate: {
            path: "players",
            select: "name image tShirtNumber idCard dateOfBirth motherName",
          },
        })
        .populate("referee", "firstName lastName role image")
        .populate("watcher", "firstName lastName role image")
        .populate("linesman_one", "firstName lastName role image")
        .populate("linesman_two", "firstName lastName role image")
        .populate("title", "name image")
        .populate("season", "seasonName")
        .populate("pitch", "name location image")
        .populate(
          "startersTeamA",
          "name image tShirtNumber idCard dateOfBirth motherName"
        )
        .populate({
          path: "detailsWatcher",
          populate: {
            path: "details.team details.playerIn details.playerOut",
            select: "name image",
          },
        })
        .lean()
        .exec();
    }

    if (teamId) {
      matches = matches.filter((match) => {
        return (
          match.team_a.team._id.toString() === teamId ||
          match.team_b.team._id.toString() === teamId
        );
      });
    }

    if (titleId) {
      matches = matches.filter((match) => {
        return match.title._id.toString() === titleId;
      });
    }

    if (seasonId) {
      matches = matches.filter((match) => {
        return match.season._id.toString() === seasonId;
      });
    }

    if (pitchId) {
      matches = matches.filter((match) => {
        return match.pitch._id.toString() === pitchId;
      });
    }

    const matchCount = matches.length;

    const { offset, limit } = req;

    matches = matches.slice(offset, offset + limit);

    if (!matches) {
      return res.status(404).json({ message: "No matches found" });
    }

    for (const match of matches) {
      let teamAScore = 0;
      let teamBScore = 0;
      let teamAFirstHalfGoals = 0;
      let teamBFirstHalfGoals = 0;
      let foundHT = false;
      let teamAPenaltyGoals = 0;
      let teamBPenaltyGoals = 0;
      let foundPenalties = false;

      if (match.detailsWatcher && match.detailsWatcher.details) {
        const events = match.detailsWatcher.details;

        for (const event of events) {
          if (event.type === "goal" && event.team) {
            const scoringTeam =
              event.team.name === match.team_a.team.name ? "team_a" : "team_b";

            if (foundPenalties && event.penalty === "scored") {
              if (scoringTeam === "team_a") {
                teamAPenaltyGoals += 1;
              } else {
                teamBPenaltyGoals += 1;
              }
            } else if (!foundPenalties) {
              if (scoringTeam === "team_a") {
                teamAScore += 1;
                if (!foundHT) teamAFirstHalfGoals += 1;
              } else {
                teamBScore += 1;
                if (!foundHT) teamBFirstHalfGoals += 1;
              }
            }
          }

          if (event.type === "HT") {
            foundHT = true;
          }

          if (event.type === "penalties") {
            foundPenalties = true;
            match.isPenalties = true;
          }
        }
      }

      match.team_a.score = teamAScore;
      match.team_b.score = teamBScore;
      match.team_a.scoreHT = teamAFirstHalfGoals;
      match.team_b.scoreHT = teamBFirstHalfGoals;
      match.team_a.scorePenalties = teamAPenaltyGoals;
      match.team_b.scorePenalties = teamBPenaltyGoals;

      const matchDate = moment(match.match_date).startOf("day");
      const currentDate = moment().startOf("day");

      const matchTime = moment.tz(match.match_time, "HH:mm", match.time_zone);
      const currentTime = moment();

      const matchHour = matchTime.hour();
      const currentHour = currentTime.hour();

      if (currentDate.diff(matchDate, "days") > 1) {
        match.reported = true;
      } else if (currentDate.diff(matchDate, "days") === 1) {
        if (matchHour < currentHour) {
          match.reported = true;
        } else {
          match.reported === false;
        }
      } else {
        match.reported = false;
      }
    }

    return res.status(200).json({ matches, matchCount });
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
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: [
          {
            path: "players",
            select: "name image tShirtNumber idCard dateOfBirth motherName",
          },
          {
            path: "administrators",
            select: "name image characteristic",
          },
        ],
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: [
          {
            path: "players",
            select: "name image tShirtNumber idCard dateOfBirth motherName",
          },
          {
            path: "administrators",
            select: "name image characteristic",
          },
        ],
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role image")
      .populate("linesman_two", "firstName lastName role image")
      .populate("title", "name image")
      .populate("season", "seasonName")
      .populate("pitch", "name location image")
      .populate(
        "startersTeamA",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate(
        "substitutesTeamA",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate("administratorsTeamA", "name image characteristic")
      .populate(
        "startersTeamB",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate(
        "substitutesTeamB",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate("administratorsTeamB", "name image characteristic")
      .populate({
        path: "detailsWatcher",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name image",
        },
      })
      .populate({
        path: "detailsReferee",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name image",
        },
      })
      .lean()
      .exec();

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    // Events Watcher
    let teamAScoreWatcher = 0;
    let teamBScoreWatcher = 0;
    let teamAFirstHalfGoalsWatcher = 0;
    let teamBFirstHalfGoalsWatcher = 0;
    let foundHTWatcher = false;
    let teamAPenaltyGoalsWatcher = 0;
    let teamBPenaltyGoalsWatcher = 0;
    let foundPenaltiesWatcher = false;

    if (match.detailsWatcher && match.detailsWatcher.details) {
      const eventsWatcher = match.detailsWatcher.details;

      for (const eventWatcher of eventsWatcher) {
        if (eventWatcher.type === "goal" && eventWatcher.team) {
          const scoringTeam =
            eventWatcher.team.name === match.team_a.team.name
              ? "team_a"
              : "team_b";

          if (foundPenaltiesWatcher && eventWatcher.penalty === "scored") {
            if (scoringTeam === "team_a") {
              teamAPenaltyGoalsWatcher += 1;
            } else {
              teamBPenaltyGoalsWatcher += 1;
            }
          } else if (!foundPenaltiesWatcher) {
            if (scoringTeam === "team_a") {
              teamAScoreWatcher += 1;
              if (!foundHTWatcher) teamAFirstHalfGoalsWatcher += 1;
            } else {
              teamBScoreWatcher += 1;
              if (!foundHTWatcher) teamBFirstHalfGoalsWatcher += 1;
            }
          }
        }

        if (eventWatcher.type === "HT") {
          foundHTWatcher = true;
        }

        if (eventWatcher.type === "penalties") {
          foundPenaltiesWatcher = true;
          match.isPenalties = true;
        }
      }
    }

    match.team_a.scoreWatcher = teamAScoreWatcher;
    match.team_b.scoreWatcher = teamBScoreWatcher;
    match.team_a.scoreHTWatcher = teamAFirstHalfGoalsWatcher;
    match.team_b.scoreHTWatcher = teamBFirstHalfGoalsWatcher;
    match.team_a.scorePenaltiesWatcher = teamAPenaltyGoalsWatcher;
    match.team_b.scorePenaltiesWatcher = teamBPenaltyGoalsWatcher;

    // Events Referee
    let teamAScoreReferee = 0;
    let teamBScoreReferee = 0;
    let teamAFirstHalfGoalsReferee = 0;
    let teamBFirstHalfGoalsReferee = 0;
    let foundHTReferee = false;
    let teamAPenaltyGoalsReferee = 0;
    let teamBPenaltyGoalsReferee = 0;
    let foundPenaltiesReferee = false;

    if (match.detailsReferee && match.detailsReferee.details) {
      const eventsReferee = match.detailsReferee.details;

      for (const eventReferee of eventsReferee) {
        if (eventReferee.type === "goal" && eventReferee.team) {
          const scoringTeam =
            eventReferee.team.name === match.team_a.team.name
              ? "team_a"
              : "team_b";

          if (foundPenaltiesReferee && eventReferee.penalty === "scored") {
            if (scoringTeam === "team_a") {
              teamAPenaltyGoalsReferee += 1;
            } else {
              teamBPenaltyGoalsReferee += 1;
            }
          } else if (!foundPenaltiesReferee) {
            if (scoringTeam === "team_a") {
              teamAScoreReferee += 1;
              if (!foundHTReferee) teamAFirstHalfGoalsReferee += 1;
            } else {
              teamBScoreReferee += 1;
              if (!foundHTReferee) teamBFirstHalfGoalsReferee += 1;
            }
          }
        }

        if (eventReferee.type === "HT") {
          foundHTReferee = true;
        }

        if (eventReferee.type === "penalties") {
          foundPenaltiesReferee = true;
          match.isPenalties = true;
        }
      }
    }

    match.team_a.scoreReferee = teamAScoreReferee;
    match.team_b.scoreReferee = teamBScoreReferee;
    match.team_a.scoreHTReferee = teamAFirstHalfGoalsReferee;
    match.team_b.scoreHTReferee = teamBFirstHalfGoalsReferee;
    match.team_a.scorePenaltiesReferee = teamAPenaltyGoalsReferee;
    match.team_b.scorePenaltiesReferee = teamBPenaltyGoalsReferee;

    const matchDate = new Date(match.match_date);
    const currentDate = new Date();

    const matchYear = matchDate.getFullYear();
    const matchMonth = matchDate.getMonth() + 1;
    const matchDay = matchDate.getDate();
    const matchHour = match.match_time.split(":")[0];
    const matchMinute = match.match_time.split(":")[1];

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    const convertTo12HourFormat = (hour) => {
      return hour % 12 === 0 ? 12 : hour % 12;
    };

    const matchHour12 = convertTo12HourFormat(matchHour);
    const currentHour12 = convertTo12HourFormat(currentHour);

    if (currentYear > matchYear) {
      match.reported = true;
    } else if (currentYear === matchYear) {
      if (currentMonth > matchMonth) {
        match.reported = true;
      } else if (currentMonth === matchMonth) {
        const dayDifference = currentDay - matchDay;
        if (dayDifference > 1) {
          match.reported = true;
        } else if (dayDifference === 1) {
          if (currentHour12 > matchHour12) {
            match.reported = true;
          } else if (currentHour12 === matchHour12) {
            if (currentMinute > matchMinute) {
              match.reported = true;
            } else {
              match.reported = false;
            }
          } else {
            match.reported = false;
          }
        } else {
          match.reported = false;
        }
      } else {
        match.reported = false;
      }
    }

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
      detailsWatcher,
      detailsReferee, // Extract detailsReferee from req.body
      linesman_one,
      linesman_two,
      match_date,
      match_time,
      time_zone,
    } = req.body;

    const formattedMatchDate = moment
      .tz(match_date, "YYYY/MM/DD", time_zone)
      .format("YYYY-MM-DD");

    const formattedMatchTime = moment
      .tz(match_time, "h:mm A", time_zone)
      .format("HH:mm");

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
      match_date: formattedMatchDate,
      match_time: formattedMatchTime,
    });

    const savedMatch = await newMatch.save();

    // Create and save MatchDetails for detailsWatcher
    const newMatchDetailsWatcher = new MatchDetails({
      detailsWatcher,
    });
    const savedMatchDetailsWatcher = await newMatchDetailsWatcher.save();
    savedMatch.detailsWatcher = savedMatchDetailsWatcher._id;

    // Create and save MatchDetails for detailsReferee
    const newMatchDetailsReferee = new MatchDetails({
      detailsReferee,
    });
    const savedMatchDetailsReferee = await newMatchDetailsReferee.save();
    savedMatch.detailsReferee = savedMatchDetailsReferee._id;

    await savedMatch.save();

    // Populate multiple fields
    const populatedMatch = await Match.findById(savedMatch._id)
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name image tShirtNumber idCard dateOfBirth motherName",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name image tShirtNumber idCard dateOfBirth motherName",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role")
      .populate("linesman_two", "firstName lastName role")
      .populate("title", "name image")
      .populate("season", "seasonName")
      .populate("pitch", "name location image")
      .populate({
        path: "detailsWatcher",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name image",
        },
      })
      .populate({
        path: "detailsReferee",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name image",
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
    const {
      match_date,
      match_time,
      time_zone,
      addStartersTeamA,
      removeStartersTeamA,
      addSubstitutesTeamA,
      removeSubstitutesTeamA,
      addAdministratorsTeamA,
      removeAdministratorsTeamA,
      addStartersTeamB,
      removeStartersTeamB,
      addSubstitutesTeamB,
      removeSubstitutesTeamB,
      addAdministratorsTeamB,
      removeAdministratorsTeamB,
      ...otherUpdatedData
    } = req.body;

    // console.log(otherUpdatedData);

    const existingMatch = await Match.findById(id);
    if (!existingMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match_date) {
      existingMatch.match_date = moment.tz(match_date, "MM/DD/YYYY").toDate();
    }

    if (match_time) {
      existingMatch.match_time = match_time;
    }

    if (addStartersTeamA && addStartersTeamA.length > 0) {
      addStartersTeamA.forEach((playerId) => {
        if (!existingMatch.startersTeamA.includes(playerId)) {
          existingMatch.startersTeamA.push(playerId);
        }
      });
    }

    if (removeStartersTeamA && removeStartersTeamA.length > 0) {
      existingMatch.startersTeamA = existingMatch.startersTeamA.filter(
        (playerId) => !removeStartersTeamA.includes(playerId.toString())
      );
    }

    if (addSubstitutesTeamA && addSubstitutesTeamA.length > 0) {
      addSubstitutesTeamA.forEach((playerId) => {
        if (!existingMatch.substitutesTeamA.includes(playerId)) {
          existingMatch.substitutesTeamA.push(playerId);
        }
      });
    }

    if (removeSubstitutesTeamA && removeSubstitutesTeamA.length > 0) {
      existingMatch.substitutesTeamA = existingMatch.substitutesTeamA.filter(
        (playerId) => !removeSubstitutesTeamA.includes(playerId.toString())
      );
    }

    if (addAdministratorsTeamA && addAdministratorsTeamA.length > 0) {
      addAdministratorsTeamA.forEach((administratorId) => {
        if (!existingMatch.administratorsTeamA.includes(administratorId)) {
          existingMatch.administratorsTeamA.push(administratorId);
        }
      });
    }

    if (removeAdministratorsTeamA && removeAdministratorsTeamA.length > 0) {
      existingMatch.administratorsTeamA =
        existingMatch.administratorsTeamA.filter(
          (administratorId) =>
            !removeAdministratorsTeamA.includes(administratorId.toString())
        );
    }

    ////

    if (addStartersTeamB && addStartersTeamB.length > 0) {
      addStartersTeamB.forEach((playerId) => {
        if (!existingMatch.startersTeamB.includes(playerId)) {
          existingMatch.startersTeamB.push(playerId);
        }
      });
    }

    if (removeStartersTeamB && removeStartersTeamB.length > 0) {
      existingMatch.startersTeamB = existingMatch.startersTeamB.filter(
        (playerId) => !removeStartersTeamB.includes(playerId.toString())
      );
    }

    if (addSubstitutesTeamB && addSubstitutesTeamB.length > 0) {
      addSubstitutesTeamB.forEach((playerId) => {
        if (!existingMatch.substitutesTeamB.includes(playerId)) {
          existingMatch.substitutesTeamB.push(playerId);
        }
      });
    }

    if (removeSubstitutesTeamB && removeSubstitutesTeamB.length > 0) {
      existingMatch.substitutesTeamB = existingMatch.substitutesTeamB.filter(
        (playerId) => !removeSubstitutesTeamB.includes(playerId.toString())
      );
    }

    if (addAdministratorsTeamB && addAdministratorsTeamB.length > 0) {
      addAdministratorsTeamB.forEach((administratorId) => {
        if (!existingMatch.administratorsTeamB.includes(administratorId)) {
          existingMatch.administratorsTeamB.push(administratorId);
        }
      });
    }

    if (removeAdministratorsTeamB && removeAdministratorsTeamB.length > 0) {
      existingMatch.administratorsTeamB =
        existingMatch.administratorsTeamB.filter(
          (administratorId) =>
            !removeAdministratorsTeamB.includes(administratorId.toString())
        );
    }

    Object.assign(existingMatch, otherUpdatedData);

    const updatedMatch = await existingMatch.save();

    const populatedMatch = await Match.findById(updatedMatch._id)
      .populate({
        path: "team_a.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name image tShirtNumber idCard dateOfBirth motherName",
        },
      })
      .populate({
        path: "team_b.team",
        select: "name image",
        populate: {
          path: "players",
          select: "name image tShirtNumber idCard dateOfBirth motherName",
        },
      })
      .populate("referee", "firstName lastName role image")
      .populate("watcher", "firstName lastName role image")
      .populate("linesman_one", "firstName lastName role image")
      .populate("linesman_two", "firstName lastName role image")
      .populate("title", "name image")
      .populate("season", "seasonName")
      .populate("pitch", "name location image")
      .populate(
        "startersTeamA",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate(
        "substitutesTeamA",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate("administratorsTeamA", "name image characteristic")
      .populate(
        "startersTeamB",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate(
        "substitutesTeamB",
        "name image tShirtNumber idCard dateOfBirth motherName"
      )
      .populate("administratorsTeamB", "name image characteristic")
      .populate({
        path: "detailsWatcher",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name image",
        },
      })
      .populate({
        path: "detailsReferee",
        populate: {
          path: "details.team details.playerIn details.playerOut",
          select: "name image",
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
