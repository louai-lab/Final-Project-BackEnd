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

// // update the team
// export const updateTeam = async (req, res) => {
//   const id = req.params.id;
//   const { name } = req.body;

//   try {
//     const existingTeam = await Team.findById(id);

//     if (!existingTeam) {
//       return res.status(404).json({ error: "Team not found" });
//     }

//     if (name) existingTeam.name = name;

//     const oldImagePath = `public/images/${existingTeam.image}`;

//     if (req.file) {
//       existingTeam.image = req.file.filename;

//       fs.unlinkSync(oldImagePath, (err) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ error: `error deleting the old image` });
//         }
//       });
//     }

//     await existingTeam.save();
//     return res.status(200).json(existingTeam);
//   } catch (error) {
//     console.error(error);
//     const imagePath = `public/images/${req.file.filename}`;
//     fs.unlinkSync(imagePath);
//     return res.status(500).json({ error: "Internal Server Error", msg: error });
//   }
// };

// // Delete Player from Team
// export const deletePlayerFromTeam = async (req, res) => {
//   const idTeam = req.params.idTeam;
//   const idPlayer = req.params.idPlayer;

//   try {
//     const existingTeam = await Team.findById(idTeam);

//     if (!existingTeam) {
//       return res.status(404).json({ error: "Team not found" });
//     }

//     const playerInTeamIndex = existingTeam.players.findIndex(
//       (player) => player._id.toString() === idPlayer
//     );

//     if (playerInTeamIndex === -1) {
//       return res.status(404).json({ error: "Player not found in the team" });
//     }

//     const playerData = existingTeam.players[playerInTeamIndex];
//     await Player.findByIdAndUpdate(idPlayer, { $set: { team: null } });

//     existingTeam.players.splice(playerInTeamIndex, 1);

//     const updatedTeam = await existingTeam.save();

//     return res.status(200).json({
//       message: "Player removed successfully",
//       updatedTeam: updatedTeam,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Add players or one player to the team
// export const addPlayersToTeam = async (req, res) => {
//   const { idTeam, playerIds } = req.body;

//   try {
//     const team = await Team.findById(idTeam);

//     if (!team) {
//       console.log("Team not found");
//       return res.status(404).json({ error: "Team not found" });
//     }

//     const players = await Player.find({ _id: { $in: playerIds } });

//     const playersWithTeams = await Player.find({
//       _id: { $in: playerIds },
//       team: { $ne: null },
//     });

//     if (playersWithTeams.length > 0) {
//       return res.status(400).json({
//         error: "One or more players are already associated with another team",
//       });
//     }

//     team.players.push(...players);

//     players.forEach((player) => {
//       player.team = team._id;
//     });

//     await Promise.all([team.save(), ...players.map((player) => player.save())]);

//     return res
//       .status(200)
//       .json({ message: "Players added successfully", team });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Update team and players

// Update team, add or remove players, and update image
export const updateTeamAndPlayers = async (req, res) => {
  const id = req.params.id;
  const { name, playerIds } = req.body;

  try {
    const existingTeam = await Team.findById(id);

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (name && name !== existingTeam.name) {
      existingTeam.name = name;
    }

    const oldImagePath = `public/images/${existingTeam.image}`;
    if (req.file) {
      existingTeam.image = req.file.filename;

      fs.unlinkSync(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting the old image:", err);
        }
      });
    }

    if (playerIds) {
      const newPlayers = await Player.find({ _id: { $in: playerIds } });

      const existingPlayerIds = existingTeam.players.map((player) =>
        player._id.toString()
      );

      // Remove existing players who are not in the new list
      for (const existingPlayer of existingTeam.players) {
        if (!playerIds.includes(existingPlayer._id.toString())) {
          // Fetch the player by ID to ensure it's a Mongoose model instance
          const playerToRemove = await Player.findById(existingPlayer._id);
          if (playerToRemove) {
            playerToRemove.team = null;
            await playerToRemove.save();
          }
        }
      }

      // Add new players who are not already in the team
      for (const newPlayer of newPlayers) {
        if (
          !existingTeam.players.some((player) =>
            player._id.equals(newPlayer._id)
          )
        ) {
          newPlayer.team = existingTeam._id;
          await newPlayer.save();
        }
      }

      existingTeam.players = newPlayers;
    }

    await existingTeam.save();
    return res.status(200).json(existingTeam);
  } catch (error) {
    console.error(error);
    const imagePath = `public/images/${req.file.filename}`;
    fs.unlinkSync(imagePath);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
