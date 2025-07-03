import mongoose, { Schema } from "mongoose";

// Định nghĩa schema cho Furniture
const FurnitureSchema = new Schema(
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

// Tạo model cho Furniture
const Furniture = mongoose.model("Furniture", FurnitureSchema, "Furnitures");

// Xuất model
export default Furniture;
