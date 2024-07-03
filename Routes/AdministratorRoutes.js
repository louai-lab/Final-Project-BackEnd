import express from "express";
import {
  addAdministrator,
  getAllAdministrators,
  updateAdministrator,
  deleteAdministrator,
} from "../Controllers/AdministratorControllers.js";
import upload from "../middleware/Multer.js";
import { paginate } from "../middleware/Pagination.js";

const administratorRoutes = express.Router();

administratorRoutes.get("/", paginate, getAllAdministrators);
administratorRoutes.post("/add", upload.single("image"), addAdministrator);
administratorRoutes.patch(
  "/update/:id",
  upload.single("image"),
  updateAdministrator
);
administratorRoutes.delete(
  "/delete/:id",
  upload.single("image"),
  deleteAdministrator
);

export default administratorRoutes;
