import Post from "../models/post.model.js";
import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js"
const getAllReport = async (req, res) => {
    try {
        const reports = await Report.find({});

        if (reports?.message === "Error") {
            return res.status(500).json(reports);
        }
        return res.status(200).json({
            message: 'Thanh cong',
            data: reports
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error",
            content: error?.message || error
        });
    }
};


const createNewReport = async (req, res) => {
    try {
        // Extract report information directly from req.body
        const { title, message, senderId, postId } = req.body;

        const user = await User.findOne({ postIds: postId })
            .select('_id fullName') // Chỉ lấy ra _id và fullName
            .populate({
                path: 'postIds',
                model: 'Post',
                match: { status: 'public' }, // Chỉ lấy các phòng có status là "public"
                select: '_id' // Chỉ lấy _id của các phòng
            });

        const receiverId = user._id;
        // Validate required fields
        if (!title || !message || !senderId || !postId) {
            return res.status(400).json({
                message: "Thiếu thông tin cần thiết để gửi báo cáo."
            });
        }

        // Create a new report instance
        const newReport = new Report({
            title,
            message,
            senderId,
            receiverId,
            postId
        });

        // Save the new report to the database
        await newReport.save();

        return res.status(201).json({
            message: "Đã gửi báo cáo về admin, cảm ơn bạn đã đóng góp cho app!"
        });
    } catch (error) {
        console.error("Error creating report:", error); // Log the error for debugging
        return res.status(500).json({
            message: "Có lỗi xảy ra khi gửi báo cáo.",
            content: error?.message || "Lỗi không xác định"
        });
    }
};

const acceptReport = async (req, res) => {
    const { reportId, receiverId } = req.body; // Expecting reportId and receiverId from the request body

    try {
        // Find the user first
        const user = await User.findById(receiverId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check remainingErrorTime before decrementing
        if (user.remainingErrorTime === undefined || user.remainingErrorTime <= 0) {
            // Update user's status to 2 if no remaining error times left
            await User.findByIdAndUpdate(receiverId, { status: 2 }, { new: true });

            return res.status(400).json({
                message: "No remaining error times left for this user. User status has been updated to band!.",
            });
        }

        // Decrement remainingErrorTime
        const updatedUser = await User.findByIdAndUpdate(
            receiverId,
            { remainingErrorTime: user.remainingErrorTime - 1 },
            { new: true }
        );

        // Update the report status to 'resolved'
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { status: "resolved" },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({
                message: "Report not found",
            });
        }

        // Create a notification message
        const notification = {
            title: "Cảnh báo vi phạm",
            message: `Chúng tôi đã nhận được báo cáo về đăng bài của bạn đang có vấn đề và tiến hành kiểm tra. Bạn còn ${updatedUser.remainingErrorTime} lần vi phạm nữa, tài khoản sẽ bị khóa tạm thời!`,
            userId: receiverId, // Directly assign the ID without wrapping in an object
            type: "individual",
        };

        // Save the notification to the database
        const newNotification = await Notification.create(notification);

        return res.status(200).json({
            message: "Report resolved successfully, a warning has been sent to the user!",
            notification: newNotification, // Return the created notification
        });
    } catch (error) {
        console.error("Error resolving report:", error); // Log the error for debugging
        return res.status(500).json({
            message: "Internal server error",
            content: error.message || "An unexpected error occurred.",
        });
    }
};





const rejectReport = async (req, res) => {
    const { reportId } = req.params; // Expecting reportId from the request body

    try {
        // Update the report status to 'rejected'
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { status: "rejected" },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({
                message: "Report not found",
            });
        }

        return res.status(200).json({
            message: "Report rejected successfully",
            report: updatedReport, // Return the updated report
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error",
            content: error?.message || error,
        });
    }
};

export default {
    getAllReport, createNewReport, acceptReport, rejectReport
};
