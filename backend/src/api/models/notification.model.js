import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users"        
        },
        type: {
            type: String,
            enum: ["all", "individual"],
            required: true
        }
    },
    {
        timestamps: true 
    }
);

const Notification = mongoose.model("Notification", NotificationSchema, "Notifications");

export default Notification;
