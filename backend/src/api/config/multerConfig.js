import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).array("images", 10);

export default upload;
