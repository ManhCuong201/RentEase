import Notification from "../models/notification.model.js";

const getAllNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({});

        if (notifications?.message === "Error") {
            return res.status(500).json(notifications);
        }
        return res.status(200).json({
            message: 'Thanh cong',
            data: notifications
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error",
            content: error?.message || error
        });
    }
};

const getNotificationByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Tìm thông báo có type là "all" hoặc thông báo có userId khớp với userId truyền vào
        const notifications = await Notification.find({
            $or: [
                { type: "all" },
                { userId: userId }
            ]
        });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            message: 'Thành công',
            data: notifications
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error",
            content: error?.message || error
        });
    }
};
export default {
    getAllNotification,
    getNotificationByUserId
};
