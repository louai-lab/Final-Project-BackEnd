import express from "express";
import {
  addAdministrator,
  getAllAdministrators,
  updateAdministrator,
  deleteAdministrator,
} from "../Controllers/AdministratorControllers.js";
import upload from "../middleware/Multer.js";
import { paginate } from "../middleware/Pagination.js";
import { ByAdmin } from "../middleware/ByAdmin.js";

const administratorRoutes = express.Router();

administratorRoutes.get("/", ByAdmin, paginate, getAllAdministrators);
administratorRoutes.post(
  "/add",
  ByAdmin,
  upload.single("image"),
  addAdministrator
);
administratorRoutes.patch(
  "/update/:id",
  ByAdmin,
  upload.single("image"),
  updateAdministrator
);
administratorRoutes.delete(
  "/delete/:id",
  ByAdmin,
  upload.single("image"),
  deleteAdministrator
);

export default administratorRoutes;
