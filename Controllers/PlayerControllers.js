import Player from "../Models/PlayerModel.js";
import Team from "../Models/TeamModel.js";

// Get All Players

export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().populate("team", "name image").exec();
    res.status(201).json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a Player
export const addPlayer = async (req, res) => {
  const { name, position, team } = req.body;

  try {
    if (!name || !position) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPlayerData = {
      name,
      position,
    };

    if (team) {
      newPlayerData.team = team;
    }

    const newPlayer = await Player.create(newPlayerData);

    // If team is provided, update the team's players array
    if (team) {
      const existingTeam = await Team.findById(team);
      if (existingTeam) {
        existingTeam.players.push(newPlayer._id);
        await existingTeam.save();
      }
    }

    res.status(201).json(newPlayer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a player

// export const updatePlayer = async (req, res) => {
//   const id = req.params.id;

//   const { name, position, team } = req.body;

//   try {
//     const existingPlayer = await Player.findById(id);

//     if (!existingPlayer) {
//       return res.status(404).json({ error: "Player not found" });
//     }

//     if (name) existingPlayer.name = name;
//     if (position) existingPlayer.position = position;

//     if (team !== undefined) {

//       const isValidTeam = await Team.exists({ _id: team });
//       if (isValidTeam) {
//         existingPlayer.team = team;
//       } else {
//         return res.status(400).json({ error: "Invalid team ID" });
//       }
//     }

//     await existingPlayer.save();
//     return res.status(200).json(existingPlayer);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error", msg: error });
//   }
// };

export const updatePlayer = async (req, res) => {
  const id = req.params.id;

  const { name, position, team } = req.body;

  try {
    const existingPlayer = await Player.findById(id);

    if (!existingPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Get the current team ID of the player
    const currentTeam = existingPlayer.team;

    // Update user fields
    if (name) existingPlayer.name = name;
    if (position) existingPlayer.position = position;

    // Update team field if provided
    if (team !== undefined) {
      // Check if the provided team ID is valid
      const isValidTeam = await Team.exists({ _id: team });
      if (isValidTeam) {
        existingPlayer.team = team;

        // If the player had a previous team, remove the player from its players array
        if (currentTeam) {
          const previousTeam = await Team.findById(currentTeam);
          if (previousTeam) {
            previousTeam.players = previousTeam.players.filter(
              (player) => player.toString() !== id
            );
            await previousTeam.save();
          }
        }

        // Add the player to the new team's players array
        const newTeam = await Team.findById(team);
        if (newTeam) {
          newTeam.players.push(existingPlayer._id);
          await newTeam.save();
        }
      } else {
        return res.status(400).json({ error: "Invalid team ID" });
      }
    }

    await existingPlayer.save();
    return res.status(200).json(existingPlayer);
  } catch (error) {
    console.error(error);
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

    await Player.deleteOne({ _id: id });

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
