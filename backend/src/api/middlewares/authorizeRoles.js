import jwt from "jsonwebtoken";

// Hàm lấy thông tin từ token
const getTokenInfoFromRequest = (req) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded; // Trả về nội dung đã giải mã
    } catch (err) {
      console.error("Token không hợp lệ:", err);
      return null;
    }
  }
  return null;
};

// Hàm phân quyền cho người dùng
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Lấy thông tin người dùng từ token
    const userInfo = getTokenInfoFromRequest(req);
    console.log(req);

    if (!userInfo) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Không có token hợp lệ" });
    }

    // Kiểm tra quyền hạn
    if (!roles.includes(userInfo.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Bạn không có quyền truy cập" });
    }

    // Gán thông tin người dùng vào request để sử dụng ở các middleware hoặc route sau
    req.user = userInfo;

    next(); // Cho phép tiếp tục đến middleware hoặc route tiếp theo
  };
};

export default authorizeRoles;
