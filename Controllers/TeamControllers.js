import Team from "../Models/TeamModel.js";
import fs from "fs";
import Player from "../Models/PlayerModel.js";
import { ObjectId } from "mongodb";

// Get all the Teams
export const getAllTeam = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(201).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a Team
export const addTeam = async (req, res) => {
  const { name, playersIds } = req.body;

  try {
    if (!name || !playersIds) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if any of the players are already associated with another team
    const teamsWithPlayers = await Team.find({
      players: {
        $elemMatch: { $in: playersIds.map((id) => new ObjectId(id)) },
      },
    });

    if (teamsWithPlayers.length > 0) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({
        error: "One or more players are already associated with another team",
      });
    }

    const players = await Player.find({
      _id: { $in: playersIds.map((id) => new ObjectId(id)) },
    });

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    const newTeam = new Team({
      name: req.body.name,
      image: image,
      players: players,
    });

    await newTeam.save();

    return res
      .status(201)
      .json({ message: "Team added successfully", team: newTeam });
  } catch (error) {
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// update the team
export const updateTeam = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    const existingTeam = await Team.findById(id);

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Update user fields
    if (name) existingTeam.name = name;

    const oldImagePath = `public/images/${existingTeam.image}`;

    if (req.file) {
      existingTeam.image = req.file.filename;

      fs.unlinkSync(oldImagePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `error deleting the old image` });
        }
      });
    }

    await existingTeam.save();
    return res.status(200).json(existingTeam);
  } catch (error) {
    console.error(error);
    const imagePath = `public/images/${req.file.filename}`;
    fs.unlinkSync(imagePath);
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// delete a team
export const deleteTeam = async (req, res) => {
  const id = req.params.id;

  try {
    const existingTeam = await Team.findById(id);

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    const imagePath = `public/images/${existingTeam.image}`;
    fs.unlinkSync(imagePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting the user's image" });
      }
    });

    await Team.deleteOne({ _id: id });

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a player from the team
export const deletePlayerFromTeam = async (req, res) => {
  const idTeam = req.params.idTeam;
  const idPlayer = req.params.idPlayer;

  try {
    const update = {
      $pull: {
        players: {
          _id: idPlayer,
        },
      },
    };

    const updatedTeam = await Team.findOneAndUpdate({ _id: idTeam }, update, {
      new: true,
    });

    if (updatedTeam) {
      return res.status(200).json({ message: "Player removed successfully" });
    } else {
      return res.status(404).json({ error: "Player not found or not removed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add player to the team
export const addPlayerToTeam = async (req, res) => {
  const { idTeam, idPlayer } = req.body;

  try {
    const player = await Player.findById(idPlayer);

    if (!player) {
      console.log("Player not found");
      return res.status(404).json({ error: "Player not found" });
    }

    const update = {
      $push: {
        players: player,
      },
    };

    const updatedTeam = await Team.findOneAndUpdate(
      { _id: idTeam },
      update,
      { new: true } // Return the modified document
    );

    if (updatedTeam) {
      return res
        .status(200)
        .json({ message: "Player added successfully", team: updatedTeam });
    } else {
      return res
        .status(404)
        .json({ error: "Team not found or player not added" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// note : when create a team with players , or when adding player to the team , to check if this player found in another team or not 
