import Team from "../Models/TeamModel.js";
import fs from "fs";
import Player from "../Models/PlayerModel.js";
import { ObjectId } from "mongodb";

// Get all the Teams
export const getAllTeam = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("players", "name position team")
      .sort({ createdAt: -1 })
      .exec();
    res.status(201).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get one Team
export const getOneTeam = async (req, res) => {
  const id = req.params.id;

  try {
    const team = await Team.findById(id)
      .populate("players", "name position team")
      .exec();

    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addTeam = async (req, res) => {
  const { name, playersIds } = req.body;
  let players;

  try {
    if (!name) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "Name is required" });
    }

    // If playersIds is not provided or is an empty array, set players to an empty array
    if (!playersIds || !Array.isArray(playersIds)) {
      players = [];
    } else {
      const ids = playersIds.map((player) => player._id);

      players = await Player.find({
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      });

      if (players.length !== playersIds.length) {
        const path = `public/images/${req.file.filename}`;
        fs.unlinkSync(path);
        return res.status(400).json({ error: "Invalid player IDs" });
      }
    }

    if (!req.file) {
      return res.status(400).json({ error: "Upload an image" });
    }

    const image = req.file.filename;

    const newTeam = new Team({
      name: req.body.name,
      image: image,
      players: playersIds,
    });

    players.forEach((player) => {
      if (!player.team) {
        player.team = newTeam._id;
      }
    });

    await Promise.all([
      newTeam.save(),
      ...(players || []).map((player) => player.save()),
    ]);

    return res.status(201).json(newTeam);
  } catch (error) {
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTeam = async (req, res) => {
  const id = req.params.id;

  try {
    const existingTeam = await Team.findById(id);

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    const playersToUpdate = await Player.find({ team: id });

    await Promise.all(
      playersToUpdate.map(async (player) => {
        player.team = null;
        await player.save();
      })
    );

    const imagePath = `public/images/${existingTeam.image}`;
    fs.unlinkSync(imagePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting the team's image" });
      }
    });

    await Team.deleteOne({ _id: id });

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
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
