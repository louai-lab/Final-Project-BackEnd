import { query } from "express";
import Player from "../Models/PlayerModel.js";
import Team from "../Models/TeamModel.js";
import fs from "fs";

// Get All Players
export const getAllPlayers = async (req, res) => {
  try {
    const { team, playerName } = req.query;

    let query = {};

    if (team) {
      query.team = team;
    }

    if (playerName) {
      query.name = { $regex: new RegExp(playerName, "i") };
    }

    let players = await Player.find(query)
      .populate("team", "name image")
      .sort({ createdAt: -1 })
      .exec();

    const playersCount = players.length;

    const { offset, limit } = req;

    players = players.slice(offset, offset + limit);

    if (!players) {
      return res.status(404).json({ message: "No Players found" });
    }

    res.status(200).json({ players, playersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Players without a Team
export const getPlayersWithoutTeam = async (req, res) => {
  try {
    const playersWithoutTeam = await Player.find({ team: null })
      .sort({ createdAt: -1 })
      .exec();

    res.status(201).json(playersWithoutTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add A Player
export const addPlayer = async (req, res) => {
  const { name, tShirtNumber, team, idCard, dateOfBirth, motherName } =
    req.body;

  try {
    if (!name) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    const newPlayerData = {
      name,
      tShirtNumber,
      team,
      idCard,
      image,
      dateOfBirth,
      motherName,
    };

    if (team) {
      newPlayerData.team = team;
    }

    const newPlayer = await Player.create(newPlayerData);

    if (team) {
      const existingTeam = await Team.findById(team);
      if (existingTeam) {
        existingTeam.players.push(newPlayer._id);
        await existingTeam.save();
      }
    }

    // Populate team information in the response
    const populatedPlayer = await Player.findById(newPlayer._id)
      .populate("team", "_id name image")
      .exec();

    res.status(201).json(populatedPlayer);
  } catch (error) {
    console.log(error);
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// update a player with team population
export const updatePlayer = async (req, res) => {
  const id = req.params.id;

  const { name, tShirtNumber, team, idCard, dateOfBirth, motherName } =
    req.body;

  try {
    const existingPlayer = await Player.findById(id);

    if (!existingPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    const currentTeam = existingPlayer.team;

    if (name) existingPlayer.name = name;
    if (tShirtNumber) existingPlayer.tShirtNumber = tShirtNumber;
    if (idCard) existingPlayer.idCard = idCard;
    if (dateOfBirth) existingPlayer.dateOfBirth = dateOfBirth;
    if (motherName) existingPlayer.motherName = motherName;

    const oldImagePath = `public/images/${existingPlayer.image}`;

    if (req.file) {
      existingPlayer.image = req.file.filename;
      // console.log(req.file.filename);

      // fs.unlinkSync(oldImagePath, (err) => {
      //   if (err) {
      //     return res
      //       .status(500)
      //       .json({ error: `error deleting the old image` });
      //   }
      // });
    }

    if (team !== undefined) {
      if (team === null || team === "") {
        if (currentTeam) {
          const previousTeam = await Team.findById(currentTeam);
          if (previousTeam) {
            previousTeam.players = previousTeam.players.filter(
              (player) => player.toString() !== id
            );
            await previousTeam.save();
          }
        }
        existingPlayer.team = null;
      } else {
        const isValidTeam = await Team.exists({ _id: team });
        if (isValidTeam) {
          existingPlayer.team = team;

          if (currentTeam) {
            const previousTeam = await Team.findById(currentTeam);
            if (previousTeam) {
              previousTeam.players = previousTeam.players.filter(
                (player) => player.toString() !== id
              );
              await previousTeam.save();
            }
          }

          const newTeam = await Team.findById(team);
          if (newTeam) {
            newTeam.players.push(existingPlayer._id);
            await newTeam.save();
          }
        } else {
          return res.status(400).json({ error: "Invalid team ID" });
        }
      }
    }

    await existingPlayer.save();

    // Populate team information
    const updatedPlayer = await Player.findById(id)
      .populate("team", "_id name image")
      .exec();

    return res.status(200).json(updatedPlayer);
  } catch (error) {
    console.log(error);
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete a Player
export const deletePlayer = async (req, res) => {
  const id = req.params.id;

  try {
    const existingPlayer = await Player.findById(id);

    if (!existingPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    const imagePath = `public/images/${existingPlayer.image}`;
    fs.unlinkSync(imagePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting the user's image" });
      }
    });

    await Player.deleteOne({ _id: id });

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
