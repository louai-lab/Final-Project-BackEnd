import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// get all users

export const getAllUsers = async (  req, res) => {
  try {
    const users = await User.find().sort({createdAt:-1});
    res.status(201).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// get all users that role "referee"
export const getAllReferees = async (  req, res) => {
  try {
    const referees = await User.find({role:"referee"}).sort({createdAt:-1});
    res.status(201).json(referees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all users that role "watcher"
export const getAllWatchers = async (req, res) => {
  try {
    const watchers = await User.find({role:"watcher"}).sort({createdAt:-1});
    res.status(201).json(watchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all users that role "linesman"
export const getAllLinesman = async (req, res) => {
  try {
    const linesMan = await User.find({role:"linesman"}).sort({createdAt:-1});
    res.status(201).json(linesMan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Get one User

export const getOneUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findOne({
      _id: userId,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
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

// Get user by token info after refreshing the page in frontend
export const loggedInUser = (req, res) => {
  return res.json({ user: req.user }).status(200);
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
        {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email,
          image: user.image,
        },
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
        .json(user);
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

// Update the user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    firstName,
    lastName,
    role,
    email,
    checkPassword,
    newPassword,
    password,
  } = req.body;

  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (checkPassword) {
      const isPasswordValid = await bcrypt.compare(
        checkPassword,
        existingUser.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }
    }

    // Update user fields
    if (firstName) existingUser.firstName = firstName;
    if (lastName) existingUser.lastName = lastName;
    if (role) existingUser.role = role;
    if (email) existingUser.email = email;
    if (newPassword) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      existingUser.password = hashedPassword;
    }
    const oldImagePath = `public/images/${existingUser.image}`;

    if (req.file) {
      existingUser.image = req.file.filename;

      fs.unlinkSync(oldImagePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `error deleting the old image` });
        }
      });
    }

    await existingUser.save();
    return res.status(200).json(existingUser);
  } catch (error) {
    console.error(error);
    const imagePath = `public/images/${req.file.filename}`;
    fs.unlinkSync(imagePath);
    return res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

// Delete an user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const imagePath = `public/images/${existingUser.image}`;
    fs.unlinkSync(imagePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting the user's image" });
      }
    });

    await User.deleteOne({ _id: id });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
