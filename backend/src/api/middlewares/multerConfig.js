import multer from "multer";

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .send("Số lượng file vượt quá giới hạn cho phép (tối đa 10 ảnh).");
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .send("Kích thước file vượt quá giới hạn cho phép.");
    }
  }
  next(err);
};

export default handleUploadErrors;
