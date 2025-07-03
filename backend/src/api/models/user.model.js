import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";

// Định nghĩa schema cho User

const PackageSchema = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pinRemaind: { type: Number, required: true, default: 0 },
    Vip: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    // Định nghĩa các trường trong schema
    fullName: {
      type: String,
      required: [true, "Full name is required"], // Yêu cầu trường này phải có
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Yêu cầu trường này phải có, thông báo tùy chỉnh
      unique: [true, "Email already exists"], // Đảm bảo email là duy nhất, thông báo tùy chỉnh
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Yêu cầu trường này phải có
    },
    dob: {
      type: Date, // Định dạng ngày sinh
      required: [false, "Date of birth is not required"],
      validate: {
        validator: function (value) {
          // Kiểm tra nếu ngày sinh nhỏ hơn ngày hiện tại
          return value < new Date();
        },
        message: "Date of birth must be in the past", // Thông báo khi ngày sinh lớn hơn ngày hiện tại
      },
    },
    gender: {
      type: String,
      required: [false, "Gender is not required"], // Không bắt buộc
      enum: {
        values: ["Male", "Female", "Other"], // Giới hạn các giá trị có thể
        message: "Gender must be either Male, Female, or Other",
      },
    },
    phoneNumber: {
      type: String,
      required: [false, "Phone number is not required"], // Không bắt buộc
      unique: [true, "Phone number already exists"],
    },
    role: {
      type: String,
      required: [true, "Role is required"], // Yêu cầu trường này phải có
      enum: {
        values: ["admin", "tenant", "landlord"],
        message: "Role must be either Admin, Tenant, or Landlord",
      },
      default: "tenant",
    },
    resetPasswordToken: {
      type: String,
      required: [false, "Reset password token is not required"], // Không bắt buộc
    },
    resetPasswordExpire: {
      type: Date,
      required: [false, "Reset password expiration date is not required"], // Không bắt buộc
    },

    verificationToken: {
      type: String, // Token dùng để xác thực email
    },

    remainingErrorTime: {
      type: Number,
      default: 3, // Giá trị mặc định
    },
    postTime: {
      type: Number,
      default: 3, // Giá trị mặc định
    },
    status: {
      type: Number,
      default: 0,
    },
    package: PackageSchema,
    postIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Phương thức để so sánh mật khẩu
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema, "Users");

export default User;
