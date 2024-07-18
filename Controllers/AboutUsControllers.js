import AboutUs from "../Models/AboutUsModel.js";
import fs from "fs";

export const addAboutUs = async (req, res) => {
  //   console.log(req.body);

  const { name, facebook, phone, email, location } = req.body;

  //   console.log(req.body);

  try {
    if (!name || !facebook || !phone) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "All field is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    const aboutUs = await AboutUs.create({
      name,
      facebook,
      phone,
      image,
    });

    return res.status(201).json(aboutUs);
  } catch (error) {}
};

export const getAboutUs = async (req, res) => {
  const id = req.params.id;

  try {
    const aboutUs = await AboutUs.findById(id);

    if (aboutUs) {
      return res.status(200).json(aboutUs);
    } else {
      res.status(404).json({ error: "About not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAboutUs = async (req, res) => {
  const id = req.params.id;

  const { name, facebook, phone, email, location } = req.body;

  console.log(req.body);

  try {
    const existingAboutUs = await AboutUs.findById(id);

    if (!existingAboutUs) {
      return res.status(404).json({ error: "About not found" });
    }

    if (name) existingAboutUs.name = name;
    if (facebook) existingAboutUs.facebook = facebook;
    if (phone) existingAboutUs.phone = phone;
    if (location) existingAboutUs.location = location;
    if (email) existingAboutUs.email = email;

    const oldImagePath = `public/images/${existingAboutUs.image}`;

    if (req.file) {
      existingAboutUs.image = req.file.filename;

      fs.unlinkSync(oldImagePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `error deleting the old image` });
        }
      });
    }

    await existingAboutUs.save();
    return res.status(200).json(existingAboutUs);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};
