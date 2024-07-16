import Title from "../Models/TitleModel.js";
import fs from "fs";

// Get All Titles
export const getAllTitles = async (req, res) => {
  try {
    const titles = await Title.find().sort({ createdAt: -1 }).exec();

    const titleCount = titles.length;

    res.status(201).json({ titles, titleCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create title
export const addTitle = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "Name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    // console.log(name);
    // console.log(image);

    const newTitle = await Title.create({
      name,
      image,
    });

    res.status(201).json(newTitle);
  } catch (error) {
    console.log(error);
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update title
export const updateTitle = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    const existingTitle = await Title.findById(id);

    if (!existingTitle) {
      return res.status(404).json({ error: "Title not found" });
    }

    if (name) existingTitle.name = name;

    const oldImagePath = `public/images/${existingTitle.image}`;

    if (req.file) {
      existingTitle.image = req.file.filename;

      fs.unlinkSync(oldImagePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `error deleting the old image` });
        }
      });
    }

    await existingTitle.save();
    return res.status(200).json(existingTitle);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete title
export const deleteTitle = async (req, res) => {
  const id = req.params.id;

  try {
    const existingTitle = await Title.findById(id);

    if (!existingTitle) {
      return res.status(404).json({ error: "Title not found" });
    }

    const imagePath = `public/images/${existingTitle.image}`;
    fs.unlinkSync(imagePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting the team's image" });
      }
    });

    await Title.deleteOne({ _id: id });

    return res.status(200).json({ message: "Title deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
