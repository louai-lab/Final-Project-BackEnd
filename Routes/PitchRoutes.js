import express from "express";
import upload from "../middleware/Multer.js";
import {
  addPitch,
  deletePitch,
  getAllPitches,
  updatePitch,
} from "../Controllers/PitchControllers.js";

const pitchRoutes = express.Router();

pitchRoutes.get("/", getAllPitches);
pitchRoutes.post("/add", upload.single("image"), addPitch);
pitchRoutes.patch("/update/:id", upload.single("image"), updatePitch);
pitchRoutes.delete("/delete/:id", upload.single("image"), deletePitch);

export default pitchRoutes;
