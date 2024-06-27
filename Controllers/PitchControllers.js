import Pitch from "../Models/PitchModel.js";
import fs from "fs";

// Get All Pitches
export const getAllPitches = async (req, res) => {
  try {
    const pitches = await Pitch.find().sort({ createdAt: -1 });

    res.status(201).json(pitches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create Pitch
export const addPitch = async (req, res) => {
  const { name, location } = req.body;

  try {
    if (!name || !location) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "Name and Location are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    const newPitch = await Pitch.create({
      name,
      location,
      image,
    });

    res.status(201).json(newPitch);
  } catch (error) {
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Pitch
export const updatePitch = async (req, res) => {
  const id = req.params.id;
  const { name, location } = req.body;

  try {
    const existingPitch = await Pitch.findById(id);

    if (!existingPitch) {
      return res.status(404).json({ error: "Pitch not found" });
    }

    if (name) existingPitch.name = name;
    if (location) existingPitch.location = location;

    const oldImagePath = `public/images/${existingPitch.image}`;

    if (req.file) {
      existingPitch.image = req.file.filename;

      fs.unlinkSync(oldImagePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `error deleting the old image` });
        }
      });
    }

    await existingPitch.save();
    return res.status(200).json(existingPitch);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete Pitch
export const deletePitch = async (req, res) => {
  const id = req.params.id;

  try {
    const existingPitch = await Pitch.findById(id);

    if (!existingPitch) {
      return res.status(404).json({ error: "Pitch not found" });
    }

    const imagePath = `public/images/${existingPitch.image}`;
    fs.unlinkSync(imagePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting the team's image" });
      }
    });

    await Pitch.deleteOne({ _id: id });

    return res.status(200).json({ message: "Pitch deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
