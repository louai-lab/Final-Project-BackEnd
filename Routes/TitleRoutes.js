import express from "express";
import upload from "../middleware/Multer.js";
import {
  addTitle,
  getAllTitles,
  updateTitle,
  deleteTitle,
} from "../Controllers/TitleControllers.js";

const titleRoutes = express.Router();

titleRoutes.get("/", getAllTitles);
titleRoutes.post("/add", upload.single("image"), addTitle);
titleRoutes.patch("/update/:id", upload.single("image"), updateTitle);
titleRoutes.delete("/delete/:id", upload.single("image"), deleteTitle);

export default titleRoutes;
