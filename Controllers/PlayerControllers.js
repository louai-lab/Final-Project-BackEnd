import Player from "../Models/PlayerModel.js";

// Get All Players

export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(201).json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a Player
export const addPlayer = async (req, res) => {
  const { name, position } = req.body;

  try {
    if (!name || !position) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPlayer = await Player.create({
      name,
      position,
    });

    res.status(201).json(newPlayer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a player

export const updatePlayer = async (req, res) => {
  const id = req.params.id;

  const { name, position } = req.body;

  try {
    const existingPlayer = await Player.findById(id);

    if (!existingPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Update user fields
    if (name) existingPlayer.name = name;
    if (position) existingPlayer.position = position;

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
