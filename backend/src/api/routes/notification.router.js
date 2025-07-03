import express from 'express';
import { notificationController } from '../controllers/index.js';

const notificationRouter = express.Router();

notificationRouter.get('/', (req, res) => {
    res.send('Đây là trang thông báo!');
});

notificationRouter.get("/all", notificationController.getAllNotification);
notificationRouter.get("/get_by_userId/:userId", notificationController.getNotificationByUserId);

export default notificationRouter;
