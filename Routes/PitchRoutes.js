import express from "express";
import upload from "../middleware/Multer.js";
import {
  addPitch,
  deletePitch,
  getAllPitches,
  updatePitch,
} from "../Controllers/PitchControllers.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const pitchRoutes = express.Router();

pitchRoutes.get("/", ByAdmin, getAllPitches);
pitchRoutes.post("/add", ByAdmin, upload.single("image"), addPitch);
pitchRoutes.patch("/update/:id", ByAdmin, upload.single("image"), updatePitch);
pitchRoutes.delete("/delete/:id", ByAdmin, upload.single("image"), deletePitch);

export default pitchRoutes;
