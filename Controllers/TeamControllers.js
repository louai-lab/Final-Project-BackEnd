import Team from "../Models/TeamModel.js";
import fs from "fs";
import Player from "../Models/PlayerModel.js";
import { ObjectId } from "mongodb";

// Get all the Teams
export const getAllTeam = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("players", "name position team")
      .exec();
    res.status(201).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a Team
export const addTeam = async (req, res) => {
  const { name, playersIds } = req.body;
  let players;

  try {
    if (!name) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "All fields are required" });
    }

    if (playersIds) {
      players = await Player.find({
        _id: { $in: playersIds.map((id) => new ObjectId(id)) },
      });

      // Check if any of the players are already associated with another team
      const playersWithTeams = players.filter((player) => player.team !== null);

      if (playersWithTeams.length > 0) {
        const path = `public/images/${req.file.filename}`;
        fs.unlinkSync(path);
        return res.status(400).json({
          error: "One or more players are already associated with another team",
        });
      }
    }

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    const newTeam = new Team({
      name: req.body.name,
      image: image,
      players: players,
    });

    // Set the team field for each player
    if (players) {
      players.forEach((player) => {
        player.team = newTeam._id;
      });
    }

    // Save the new team and updated players
    await Promise.all([
      newTeam.save(),
      ...(players || []).map((player) => player.save()),
    ]);

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

// Delete Player from Team
// export const deletePlayerFromTeam = async (req, res) => {
//   const idTeam = req.params.idTeam;
//   const idPlayer = req.params.idPlayer;

//   try {
//     const existingTeam = await Team.findById(idTeam);

//     if (!existingTeam) {
//       return res.status(404).json({ error: "Team not found" });
//     }

//     existingTeam.players = existingTeam.players.filter(
//       (player) => player._id.toString() !== idPlayer
//     );

//     const updatedTeam = await existingTeam.save();

//     if (updatedTeam) {
//       return res.status(200).json({ message: "Player removed successfully" });
//     } else {
//       return res.status(404).json({ error: "Player not found or not removed" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Delete Player from Team
export const deletePlayerFromTeam = async (req, res) => {
  const idTeam = req.params.idTeam;
  const idPlayer = req.params.idPlayer;

  try {
    // Find the team
    const existingTeam = await Team.findById(idTeam);

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Find the player in the team
    const playerInTeamIndex = existingTeam.players.findIndex(
      (player) => player._id.toString() === idPlayer
    );

    if (playerInTeamIndex === -1) {
      return res.status(404).json({ error: "Player not found in the team" });
    }

    // Update the player's team field to null
    const playerData = existingTeam.players[playerInTeamIndex];
    await Player.findByIdAndUpdate(idPlayer, { $set: { team: null } });

    // Remove the player from the team's players array
    existingTeam.players.splice(playerInTeamIndex, 1);

    // Save the updated team
    const updatedTeam = await existingTeam.save();

    return res
      .status(200)
      .json({
        message: "Player removed successfully",
        updatedTeam: updatedTeam,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add players or one player to the team
export const addPlayersToTeam = async (req, res) => {
  const { idTeam, playerIds } = req.body;

  try {
    const team = await Team.findById(idTeam);

    if (!team) {
      console.log("Team not found");
      return res.status(404).json({ error: "Team not found" });
    }

    // Fetch players by their IDs
    const players = await Player.find({ _id: { $in: playerIds } });

    // Check if any of the players are already associated with another team
    const playersWithTeams = await Player.find({
      _id: { $in: playerIds },
      team: { $ne: null },
    });

    if (playersWithTeams.length > 0) {
      return res.status(400).json({
        error: "One or more players are already associated with another team",
      });
    }

    // Add players to the team
    team.players.push(...players);

    // Set the team field for each player
    players.forEach((player) => {
      player.team = team._id;
    });

    // Save the updated team and players
    await Promise.all([team.save(), ...players.map((player) => player.save())]);

    return res
      .status(200)
      .json({ message: "Players added successfully", team });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// note : when create a team with players , or when adding player to the team , to check if this player found in another team or not
