import express from "express";
import MatchDetails from "../Models/MatchDetailsModel.js";

// get all matcheDetails
export const getAllMatchDetails = async (req, res) => {
  try {
    const matcheDetails = await MatchDetails.find()
      .populate("details.team", "name")
      .populate("details.player", "name")
      .exec();

    return res.status(200).json(matcheDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// create a matchDetails , it will be created when i create a Match
export const createMatchDetails = async (req, res) => {
  try {
    const { details } = req.body;

    const newMatchDetails = await MatchDetails.create({ details });

    return res.status(201).json(newMatchDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// update a matchDetails , && add an object (new detail in the details array) , 
// it is just pass the MatchDetails Id to add an object to array of details
export const updateMatchDetails = async (req, res) => {
  const id = req.params.id;

  const newDetailsObject = req.body;

  try {
    const updatedMatchDetails = await MatchDetails.findOneAndUpdate(
      { _id: id },
      { $push: { details: newDetailsObject } },
      { new: true }
    )
      .populate("details.team", "name")
      .populate("details.player", "name")
      .exec();
    return res.status(200).json(updatedMatchDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

// update a matchDetails , && delete an object ( detail in the details array) ,
// it is just pass the MatchDetails Id , and also passing the exact id of the object that i want it to delete
export const deleteObject = async (req, res) => {
  const id = req.params.id;
  const matchDetailsId = req.params.matchId;

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
