import mongoose, { Schema } from "mongoose";

// Định nghĩa schema cho Service
const ServiceSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true // Tự động thêm createdAt và updatedAt
    }
);

// Tạo model cho Service
const Service = mongoose.model("Service", ServiceSchema, "Services");

// Xuất model
export default Service;
