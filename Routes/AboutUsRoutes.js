import express from "express";
import upload from "../middleware/Multer.js";
import {
  addAboutUs,
  getAboutUs,
  updateAboutUs,
} from "../Controllers/AboutUsControllers.js";

const aboutUsRoutes = express.Router();

aboutUsRoutes.get("/:id", getAboutUs);
aboutUsRoutes.post("/add", upload.single("image"), addAboutUs);
aboutUsRoutes.patch("/update/:id", upload.single("image"), updateAboutUs);

export default aboutUsRoutes;
