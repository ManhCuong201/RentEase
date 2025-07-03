import express from "express";
import userRouter from "./user.router.js";
import paymentRouter from "./payment.router.js";
import FurnitureRouter from "./furniture.router.js";
import ServiceRouter from "./service.router.js";
import bookingRouter from "./booking.router.js";
import postRouter from "./post.router.js";
import UploadRouter from "./upload.router.js";
import reportRouter from "./report.router.js";
import notificationRouter from "./notification.router.js";

const router = express.Router();

router.use("/auth", userRouter);
router.use("/post", postRouter);
router.use("/payment", paymentRouter);
router.use("/furniture", FurnitureRouter);
router.use("/service", ServiceRouter);
router.use("/booking", bookingRouter);
router.use("/images", UploadRouter);
router.use("/report", reportRouter);
router.use("/notification", notificationRouter);

export default router;
