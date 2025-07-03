import { userRepository } from "../repositories/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import localIP from "../utils/getIp.js";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
dotenv.config();
const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Sử dụng dịch vụ Gmail
    auth: {
      user: process.env.EMAIL_USER || "hieukdgvt@gmail.com",
      pass: process.env.EMAIL_PASS || "fxhz wvny tkwt ddww",
    },
  });

  const mailOptions = {
    from: "RentEase Support Team",
    to: user.email,
    subject: "Xác nhận tài khoản",
    html: `<p>Chào ${user.fullName},</p>
           <p>Vui lòng xác nhận tài khoản của bạn bằng cách nhấn vào liên kết dưới đây:</p>
           <a href="http://${localIP}:8080/api/auth/verify-email?token=${token}">Xác nhận email</a>`,
  };

  await transporter.sendMail(mailOptions);
};
const login = async (req) => {
  const { email, password } = req; // Nhận mật khẩu đã băm từ frontend
  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return {
        status: "error",
        message: "Tài khoản hoặc mật khẩu không chính xác.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: "error",
        message: "Tài khoản hoặc mật khẩu không chính xác.",
      };
    }

    if (user.status === 0) {
      return {
        status: "error",
        message: "Tài khoản chưa được kích hoạt hoặc đã bị ban.",
      };
    }

    const DateNow = new Date();

    if (
      user.role === "landlord" &&
      user.package &&
      new Date(user.package.endDate) < DateNow
    ) {
      user.role = "tenant";
    }

    // Tạo JWT token khi đăng nhập thành công
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        _id: user._id,
        package: user.package,
        dob: user.dob,
        gender: user.gender,
      }, // Payload của JWT
      process.env.JWT_SECRET, // Secret key (bạn cần đặt biến môi trường cho secret này)
      { expiresIn: "1h" } // Thời gian hết hạn token
    );

    return {
      status: "success",
      message: "Đăng nhập thành công.",
      token,
    };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
};

const FindAll = async (req) => {
  try {
    const users = await userRepository.findAll(req); // Đảm bảo gọi đúng hàm
    return users;
  } catch (error) {
    return {
      message: "Error",
      content: error.toString(),
    };
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash password với bcrypt
    return hashedPassword; // Trả về mật khẩu đã được hash
  } catch (error) {
    throw new Error(error); // Ném lỗi ra ngoài để controller xử lý
  }
};

const checkEmailExists = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("Email not found");
  }
  return user;
};

const registerUser = async (userData) => {
  const { email, password } = userData;

  // Kiểm tra xem email có tồn tại hay không
  const existingUserByEmail = await userRepository.findUserByEmail(email);
  if (existingUserByEmail) {
    throw new Error("Email đã tồn tại");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  userData.password = hashedPassword;

  // Tạo token xác nhận email
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Lưu thông tin người dùng kèm token vào database
  const newUser = await userRepository.createUser({
    ...userData,
    verificationToken: token,
  });

  // Gửi email xác nhận
  await sendVerificationEmail(newUser, token);

  return newUser;
};

// Tìm chi tiết User profile
const FindOne = async (req) => {
  const { id } = req.params;

  try {
    if (id) {
      const user = await userRepository.findUser(id);
      return user;
    }
  } catch (error) {
    return {
      message: "Error",
      content: error.toString(),
    };
  }
};

const UpdateOne = async (req) => {
  const { id } = req.params;
  const updateData = req.body; // Lấy tất cả dữ liệu từ req.body

  try {
    const updatedUser = await userRepository.UpdateOne(id, updateData);
    return updatedUser;
  } catch (error) {
    return {
      message: "Error",
      content: error.toString(),
    };
  }
};

const UpdateStatus = async (id, status) => {
  const user = await User.findById(id);

  if (!user || user.role === "admin") {
    throw new Error(
      "User not found or does not have permission to change the post status!"
    );
  }

  // Update user status
  const updatedUser = await userRepository.UpdateOne(id, { status: status });

  if (status === 1) {
    return {
      status: 200,
      message: `${updatedUser.fullName} đã được kích hoạt thành công!`,
    };
  }

  // If status is 0, update all associated posts with status "public"
  if (status === 0 && user.postIds && user.postIds.length > 0) {
    let pinIncrement = 0; // Track the number of pinned posts

    // Loop through each postId and apply conditional updates
    for (let postId of user.postIds) {
      const post = await Post.findById(postId);

      if (post && post.status === "public") {
        // Update post status to "draft"
        let updateFields = { status: "draft" };

        // If post is pinned, unpin it and increase pinIncrement
        if (post.pin === true) {
          updateFields.pin = false;
          pinIncrement += 1;
        }

        await Post.findByIdAndUpdate(postId, updateFields, { new: true });
      }
    }

    // Increment user's package pinRemaind if there were pinned posts
    if (pinIncrement > 0) {
      await User.findByIdAndUpdate(
        id,
        { $inc: { "package.pinRemaind": pinIncrement } },
        { new: true }
      );
    }
  }

  return {
    status: 200,
    message: `${updatedUser.fullName} đã được vô hiệu hóa và tất cả các bài đăng đã chuyển sang trạng thái nháp!`,
  };
};
export default {
  FindAll,
  login,
  checkEmailExists,
  hashPassword,
  registerUser,
  FindOne,
  UpdateOne,
  UpdateStatus,
};
