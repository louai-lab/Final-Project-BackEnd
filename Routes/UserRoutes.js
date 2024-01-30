import express from 'express';
import upload from '../middleware/Multer.js';
import { resgister } from '../Controllers/UsersControllers.js';

const userRoutes = express.Router();

userRoutes.post('/' , upload.single('image') , resgister)

export default userRoutes