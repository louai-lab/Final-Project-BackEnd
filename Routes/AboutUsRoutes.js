import express from "express";
import upload from "../middleware/Multer.js";
import {
  addAboutUs,
  getAboutUs,
  updateAboutUs,
} from "../Controllers/AboutUsControllers.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const aboutUsRoutes = express.Router();

aboutUsRoutes.get("/:id", getAboutUs);
aboutUsRoutes.post("/add", ByAdmin, upload.single("image"), addAboutUs);
aboutUsRoutes.patch(
  "/update/:id",
  ByAdmin,
  upload.single("image"),
  updateAboutUs
);

export default aboutUsRoutes;
