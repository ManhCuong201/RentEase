import express from "express";
import { postController } from "../controllers/index.js";

const FurnitureRouter = express.Router();

// Get furnitures
FurnitureRouter.get("/", postController.getAllFurnitures);

export default FurnitureRouter;
