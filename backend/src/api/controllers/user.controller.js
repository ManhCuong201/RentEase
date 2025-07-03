import jsonwebtoken from "jsonwebtoken";
import { userService } from "../services/index.js";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  const reqestInfo = req.body;
  try {
    const response = await userService.login(reqestInfo);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: error?.message || error.toString(),
    });
  }
};

const FindAll = async (req, res) => {
  try {
    const response = await userService.FindAll(req);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

// Hàm hash mật khẩu
const hashPasswordController = async (req, res) => {
  const { password } = req.body;

  try {
    const hashedPassword = await userService.hashPassword(password); // Gọi service để hash
    res.status(200).json({ hashedPassword }); // Trả về mật khẩu đã hash
  } catch (error) {
    res.status(500).json({ message: error.message }); // Xử lý lỗi nếu có
  }
};

const checkEmailAdmin = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await userService.checkEmailExists(email); // Gọi service để kiểm tra email

    if (user.role === "admin") {
      const token = jsonwebtoken.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
        "secretKey",
        { expiresIn: "1h" }
      ); // Thay 'secretKey' bằng khóa bí mật của bạn
      return res.json({ token });
    } else {
      return res.json({ message: "User is not an admin" }); // Trả về thông tin nếu không phải admin
    }
  } catch (error) {
    res.status(404).json({ message: error.message }); // Trả về lỗi nếu không tìm thấy email
  }
};

const loginAdmin = async (req, res) => {
  // const credentital = req.body.credential;
  // return res.status(200).json(req.body);
  const reqestInfo = req.body;
  try {
    const response = await userService.login(reqestInfo);
    // const statusCode = response.statusCode == 1 ? 200 : 400;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: error?.message || error.toString(),
    });
  }
};

const register = async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateOne = async (req, res) => {
  try {
    // Kiểm tra xem người dùng có tồn tại hay không
    const response = await userService.FindOne(req);
    if (!response) {
      return res.status(404).json("User Not Found");
    }

    // Cập nhật dữ liệu
    const updatedUser = await userService.UpdateOne(req);
    return res.status(200).json({
      // message: `Updated ${updatedUser.email} status successfull!`,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Giải mã token để lấy email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.checkEmailExists(decoded.email);

    // Kiểm tra xem người dùng có xác thực trước đó hay chưa
    if (user.status === 1) {
      return res.status(400).json({ message: "Tài khoản đã được xác thực" });
    }

    // Cập nhật trạng thái xác thực của người dùng
    user.status = 1;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Xác thực email thành công!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const status = req.body; // Lấy tất cả dữ liệu từ req.body

  try {
    const result = await userService.UpdateStatus(id, status.status);
    return res.status(200).json(result);
  } catch (error) {
    return {
      message: "Error",
      content: error.toString(),
    };
  }
};

export default {
  FindAll,
  login,
  loginAdmin,
  hashPasswordController,
  checkEmailAdmin,
  register,
  UpdateOne,
  verifyEmail,
  updateStatus,
};
