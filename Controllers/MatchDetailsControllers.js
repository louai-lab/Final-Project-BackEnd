import MatchDetails from "../Models/MatchDetailsModel.js";
import Match from "../Models/MatchModel.js";

import { io } from "../server.js";

// get all matcheDetails
export const getAllMatchDetails = async (req, res) => {
  try {
    const matcheDetails = await MatchDetails.find()
      .populate("details.team", "name")
      .populate("details.playerIn", "name")
      .populate("details.playerOut", "name")
      .exec();

    return res.status(200).json(matcheDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// create a matchDetails , it will be created by default when i create a Match
export const createMatchDetails = async (req, res) => {
  try {
    const { details } = req.body;

    const populatedDetails = await MatchDetails.populate(details, {
      path: "team playerIn playerOut",
      select: "name",
    });

    const newMatchDetails = await MatchDetails.create({
      details: populatedDetails,
    });

    return res.status(201).json(newMatchDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// update a matchDetails , && add an object (new detail in the details array) ,
// it is just pass the MatchDetails Id , and in the body the detail (goal , ...)
// to add an object to array of details

// updateMatchDetailsWatcher and updateMatchDetailsReferee are same , but i did diferieate them for handling socketio just for object watcher
export const updateMatchDetailsWatcher = async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const matchId = req.params.matchId;

  const { type, team, minute, playerIn, playerOut, penalty, match } = req.body;

  const dataMatch = await Match.findById(matchId);

  if (userId !== dataMatch.watcher.toString()) {
    return res.status(403).json({
      message: "You are not authorized to update this match details.",
    });
  }

  try {
    let newDetailsObject = { type, minute };

    if (penalty) {
      newDetailsObject.penalty = penalty;
    }

    if (team) {
      newDetailsObject.team = team;
    }
    if (playerIn) {
      newDetailsObject.playerIn = playerIn;
    }
    if (type === "substitution" && playerOut) {
      newDetailsObject.playerOut = playerOut;
    }

    if (match) {
      newDetailsObject.match = match;
    }

    // console.log(newDetailsObject)

    const updatedMatchDetails = await MatchDetails.findOneAndUpdate(
      { _id: id },
      { $push: { details: newDetailsObject } },
      { new: true }
    )
      .populate("details.team", "name")
      .populate("details.playerIn details.playerOut", "name image")
      .exec();

    if (type === "goal") {
      const populatedDetailsObject = await MatchDetails.findOne({ _id: id })
        .select({ details: { $slice: -1 } }) // Get the last inserted details
        .populate("details.team", "name")
        .populate("details.playerIn details.playerOut", "name image")
        .exec();

      const goalDetails = populatedDetailsObject.details[0];

      // const adminUser = await User.findOne({ role: "admin" }).exec();

      // if (adminUser) {
      //   console.log("socket id of admin", adminUser.socketId);
      //   io.to(adminUser.socketId).emit("newMatchDetail", goalDetails);
      // }

      io.emit("newMatchDetail", goalDetails);
    }

    return res.status(200).json(updatedMatchDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

// update a matchDetails , && add an object (new detail in the details array) ,
// it is just pass the MatchDetails Id , and in the body the detail (goal , ...)
// to add an object to array of details
export const updateMatchDetailsReferee = async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const matchId = req.params.matchId;

  const { type, team, minute, playerIn, playerOut, penalty } = req.body;

  const dataMatch = await Match.findById(matchId);

  if (userId !== dataMatch.referee.toString()) {
    return res.status(403).json({
      message: "You are not authorized to update this match details.",
    });
  }

  try {
    let newDetailsObject = { type, minute };

    if (penalty) {
      newDetailsObject.penalty = penalty;
    }

    if (team) {
      newDetailsObject.team = team;
    }
    if (playerIn) {
      newDetailsObject.playerIn = playerIn;
    }
    if (type === "substitution" && playerOut) {
      newDetailsObject.playerOut = playerOut;
    }

    const updatedMatchDetails = await MatchDetails.findOneAndUpdate(
      { _id: id },
      { $push: { details: newDetailsObject } },
      { new: true }
    )
      .populate("details.team", "name")
      .populate("details.playerIn details.playerOut", "name image")
      .exec();

    // if (type === "goal") {
    //   io.emit("newMatchDetail", { message: "hello goal" });
    // }

    return res.status(200).json(updatedMatchDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

// update a matchDetails , && delete an object ( detail in the details array) ,
// it is just pass the MatchDetails Id , and also passing the exact id of the object that i want it to delete
export const deleteObject = async (req, res) => {
  const id = req.params.id;
  const matchDetailsId = req.params.matchDetailsId;

  try {
    const match = await MatchDetails.findByIdAndUpdate(
      matchDetailsId,
      { $pull: { details: { _id: id } } },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    return res.status(200).json(match);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateObject = async (req, res) => {
  const id = req.params.id;
  const matchDetailsId = req.params.matchDetailsId;
  const newData = req.body;

  try {
    const updateFields = {
      "details.$.type": newData.type || "",
      "details.$.team": newData.team || "",
      "details.$.playerIn": newData.playerIn || "",
      "details.$.playerOut": newData.playerOut || null,
      "details.$.minute": newData.minute || "",
    };

    const match = await MatchDetails.findOneAndUpdate(
      { _id: matchDetailsId, "details._id": id },
      {
        $set: updateFields,
      },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    return res.status(200).json(match);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
