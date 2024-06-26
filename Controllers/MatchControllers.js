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
      .populate({
        path: "detailsWatcher",
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

    // console.log(match)

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

    const newMatchDetails = new MatchDetails({
      detailsWatcher,
    });

    const savedMatchDetails = await newMatchDetails.save();

    savedMatch.detailsWatcher = savedMatchDetails._id;
    await savedMatch.save();

    // res.status(201).json(savedMatch);

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
      existingMatch.match_time = match_time;
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
      .populate({
        path: "detailsWatcher",
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
