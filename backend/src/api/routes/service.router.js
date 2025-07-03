import express from "express";
import { postController } from "../controllers/index.js";

const ServiceRouter = express.Router();

// Get furnitures
ServiceRouter.get("/", postController.getAllServices);

export default ServiceRouter;
