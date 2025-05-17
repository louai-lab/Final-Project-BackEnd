import express from "express";
import upload from "../middleware/Multer.js";
import {
  addTitle,
  getAllTitles,
  updateTitle,
  deleteTitle,
} from "../Controllers/TitleControllers.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const titleRoutes = express.Router();

titleRoutes.get("/", ByAdmin, getAllTitles);
titleRoutes.post("/add", ByAdmin, upload.single("image"), addTitle);
titleRoutes.patch("/update/:id", ByAdmin, upload.single("image"), updateTitle);
titleRoutes.delete("/delete/:id", ByAdmin, upload.single("image"), deleteTitle);

export default titleRoutes;
