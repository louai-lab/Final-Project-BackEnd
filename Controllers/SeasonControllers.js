import Season from "../Models/SeasonModel.js";

// Get All Seasons
export const getAllSeasons = async (req, res) => {
  try {
    const seasons = await Season.find().sort({ createdAt: -1 });

    res.status(201).json(seasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create Season
export const createSeason = async (req, res) => {
  try {
    const { firstPart, secondPart } = req.body;

    // const regex = /^\d{4}\/\d{4}$/;
    // if (!regex.test(seasonName)) {
    //   return res.status(400).json({
    //     error:
    //       "Invalid seasonName format. It should be in the format YYYY/YYYY.",
    //   });
    // }

    const newSeason = await Season.create({
      // seasonName,
      firstPart,
      secondPart,
    });

    res.status(201).json(newSeason);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Season
export const updateSeason = async (req, res) => {
  const id = req.params.id;

  const { firstPart, secondPart } = req.body;

  // const seasonNamePattern = /^\d{4}\/\d{4}$/;

  try {
    // if (seasonName && !seasonNamePattern.test(seasonName)) {
    //   return res.status(400).json({
    //     error: "Invalid seasonName format. Expected format is YYYY/YYYY.",
    //   });
    // }

    const existingSeason = await Season.findById(id);

    if (!existingSeason) {
      return res.status(404).json({ error: "Season not found" });
    }

    // if (seasonName) existingSeason.seasonName = seasonName;

    if (firstPart) existingSeason.firstPart = firstPart;
    if (secondPart) existingSeason.secondPart = secondPart;

    await existingSeason.save();
    return res.status(200).json(existingSeason);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete Season
export const deleteSeason = async (req, res) => {
  const id = req.params.id;

  try {
    const existingSeason = await Season.findById(id);

    if (!existingSeason) {
      return res.status(404).json({ error: "Season not found" });
    }

    await Season.deleteOne({ _id: id });

    return res.status(200).json({ message: "Season deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
