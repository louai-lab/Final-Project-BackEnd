import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs, { access } from "fs";
import mongoose from "mongoose";

// Register
export const resgister = async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!req.file) {
      return res.status(400).json({ error: "upload an image" });
    }

    const image = req.file.filename;

    const newUser = await User.create({
      firstName,
      lastName,
      role,
      email,
      password: hashedPassword,
      image,
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
