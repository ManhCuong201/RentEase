import express from "express";
import reportController from "../controllers/report.controller.js";

const reportRouter = express.Router();

reportRouter.get("/", (req, res) => {
  res.send("Đây là trang báo cáo!");
});

reportRouter.get("/all", reportController.getAllReport);
reportRouter.post("/create", reportController.createNewReport);
reportRouter.post("/accept", reportController.acceptReport);
reportRouter.post("/reject/:reportId", reportController.rejectReport);

export default reportRouter;
