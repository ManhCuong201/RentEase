// routes/uploadRouter.js

import express from "express";
import uploadImages from "../services/image.service.js";
import upload from "../config/multerConfig.js";
import handleUploadErrors from "../middlewares/multerConfig.js";

const UploadRouter = express.Router();

UploadRouter.post("/upload", (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return handleUploadErrors(err, req, res);
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send("Không có file nào được upload.");
      }

      const uploadedFiles = await uploadImages(req.files);
      res.status(200).json(uploadedFiles);
    } catch (error) {
      next(error);
    }
  });
});

UploadRouter.post("/delete", async (req, res, next) => {
  try {
    const { imageUrls } = req.body;

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).send("No image URLs provided.");
    }

    await deleteFilesFromFirebaseStorage(imageUrls);

    res.status(200).send("Files deleted successfully.");
  } catch (error) {
    next(error);
  }
});

export default UploadRouter;
