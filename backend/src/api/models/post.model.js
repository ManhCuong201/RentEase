import mongoose, { Schema } from "mongoose";

// Định nghĩa schema cho Address
const AddressSchema = new Schema(
  {
    city: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    district: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    ward: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    detail: { type: String, required: true },
  },
  { _id: false }
);

// Định nghĩa schema cho Coordinate
const CoordinateSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

// Định nghĩa schema cho EstimatedCosts
const EstimatedCostsSchema = new Schema(
  {
    electricity: { type: Number, required: true },
    water: { type: Number, required: true },
    wifi: { type: Number, required: true },
    service: { type: Number, required: true },
  },
  { _id: false }
);

// Định nghĩa schema cho Post
const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    squareMeter: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    images: [{ type: String, required: true }],
    capacity: { type: Number, required: true },
    description: { type: String, required: true },
    estimatedCosts: EstimatedCostsSchema,
    address: AddressSchema,
    coordinate: CoordinateSchema,
    furnitures: [{ type: Schema.Types.ObjectId, ref: "Furnitures" }], // Tham chiếu tới collection Furnitures
    services: [{ type: Schema.Types.ObjectId, ref: "Services" }], // Tham chiếu tới collection Services
    status: { type: String, required: true }, // "draft", "public", "scheduled",  "banned"
    pin: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model cho Post
const Post = mongoose.model("Post", PostSchema, "Posts"); // Dùng "Post" để nhất quán

// Xuất model
export default Post;
