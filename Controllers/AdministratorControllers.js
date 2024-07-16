import Administrator from "../Models/AdministratorModel.js";
import fs from "fs";
import Team from "../Models/TeamModel.js";

// Get All the Administrators
export const getAllAdministrators = async (req, res) => {
  try {
    let administrators = await Administrator.find()
      .populate("team", "name image")
      .sort({ createdAt: -1 })
      .exec();

    const administratorsCount = administrators.length;

    const { offset, limit } = req;

    administrators = administrators.slice(offset, offset + limit);

    if (!administrators) {
      return res.status(404).json({ message: "No Administrators found" });
    }

    res.status(200).json({ administrators, administratorsCount });

    // res.status(200).json({ administrators, administratorsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create Administrator
export const addAdministrator = async (req, res) => {
  const { name, characteristic, team } = req.body;

  try {
    if (!name || !characteristic) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    const newAdministratorData = {
      name,
      characteristic,
      team,
      image,
    };

    const newAdministrator = await Administrator.create(newAdministratorData);

    if (team) {
      const existingTeam = await Team.findById(team);
      if (existingTeam) {
        existingTeam.administrators.push(newAdministrator._id);
        await existingTeam.save();
      }
    }

    // Populate team information in the response
    const populatedAministrator = await Administrator.findById(
      newAdministrator._id
    )
      .populate("team", "_id name image")
      .exec();

    res.status(201).json(populatedAministrator);
  } catch (error) {
    console.log(error);
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Administartor with team population
export const updateAdministrator = async (req, res) => {
  const id = req.params.id;

  const { name, characteristic, team } = req.body;

  try {
    const existingAdministrator = await Administrator.findById(id);

    if (!existingAdministrator) {
      return res.status(404).json({ error: "Administrator not found" });
    }

    const currentTeam = existingAdministrator.team;

    if (name) existingAdministrator.name = name;
    if (characteristic) existingAdministrator.characteristic = characteristic;

    const oldImagePath = `public/images/${existingAdministrator.image}`;

    if (req.file) {
      existingAdministrator.image = req.file.filename;
      // console.log(req.file.filename);

      fs.existsSync(oldImagePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `error deleting the old image` });
        }
      });
    }

    if (team !== undefined) {
      if (team === null || team === "") {
        if (currentTeam) {
          const previousTeam = await Team.findById(currentTeam);
          if (previousTeam) {
            previousTeam.administrators = previousTeam.administrators.filter(
              (administrator) => administrator.toString() !== id
            );
            await previousTeam.save();
          }
        }
        existingAdministrator.team = null;
      } else {
        const isValidTeam = await Team.exists({ _id: team });
        if (isValidTeam) {
          existingAdministrator.team = team;

          if (currentTeam) {
            const previousTeam = await Team.findById(currentTeam);
            if (previousTeam) {
              previousTeam.administrators = previousTeam.administrators.filter(
                (administrator) => administrator.toString() !== id
              );
              await previousTeam.save();
            }
          }

          const newTeam = await Team.findById(team);
          if (newTeam) {
            newTeam.administrators.push(existingAdministrator._id);
            await newTeam.save();
          }
        } else {
          return res.status(400).json({ error: "Invalid team ID" });
        }
      }
    }

    await existingAdministrator.save();

    // Ppulate team information
    const updatedAdministartor = await Administrator.findById(id)
      .populate("team", "_id name image")
      .exec();

    return res.status(200).json(updatedAdministartor);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete Administrator
export const deleteAdministrator = async (req, res) => {
  const id = req.params.id;

  try {
    const existingAdministrator = await Administrator.findById(id);

    if (!existingAdministrator) {
      return res.status(404).json({ error: "Admiistrator not found" });
    }

    if (existingAdministrator.image) {
      const imagePath = `public/images/${existingAdministrator.image}`;
      fs.unlinkSync(imagePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error deleting the administrator's image" });
        }
      });
    }

    await Administrator.deleteOne({ _id: id });

    res.status(200).json({ message: "Administrator deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
