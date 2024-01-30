import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// get all users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Register
export const resgister = async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !role) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(404).json({ error: "Email already exists" });
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
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Email or password is incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: "true",
          sameSite: "None",
        })
        .status(200)
        .json({ user, token });
    } else {
      return res.status(401).json({ error: "Password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Log Out
export const logout = (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully Logged Out!" });
};

// Add An User
export const addUser = async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !role) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const path = `public/images/${req.file.filename}`;
      fs.unlinkSync(path);
      return res.status(404).json({ error: "Email already exists" });
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

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    const path = `public/images/${req.file.filename}`;
    fs.unlinkSync(path);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
