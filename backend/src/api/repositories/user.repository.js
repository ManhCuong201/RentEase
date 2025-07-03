import Users from "../models/user.model.js";

// Hàm tìm người dùng theo email
const findUserByEmail = async (email) => {
  try {
    const user = Users.findOne({ email: email });

    return await user;
  } catch (error) {
    throw new Error("Failed to find user by email: " + error.message);
  }
};

// Hàm lấy tất cả người dùng
const findAllUsers = async () => {
  try {
    return await Users.find();
  } catch (error) {
    throw new Error("Failed to retrieve users: " + error.message);
  }
};

const createUser = async (userData) => {
  try {
    const user = new Users(userData);
    return await user.save();
  } catch (error) {
    throw new Error("Failed to create user: " + error.message);
  }
};

const findUserById = async (id) => {
  try {
    const existedUser = await Users.findById(id).exec();
    return existedUser;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};

const findAll = async (req) => {
  // Phân trang
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;

  // Tìm theo email và name
  const { text } = req.query; // Lấy query 'text' từ request
  let query = {};

  // Nếu có text, thêm vào điều kiện tìm kiếm cho cả email và name
  if (text) {
    query = {
      $or: [
        { email: { $regex: text, $options: "i" } }, // Tìm kiếm trong email
        { fullName: { $regex: text, $options: "i" } }, // Tìm kiếm trong name
      ],
    };
  }

  const startIndex = (page - 1) * size;

  // Sửa dòng này
  const existedUser = await Users.find(query)
    .select("email fullName status role")
    .skip(startIndex)
    .limit(size)
    .exec(); // Sửa 'size' thành 'limit'

  const total = await Users.countDocuments(query); // Đảm bảo 'Users' được định nghĩa và nhập đúng

  return {
    user: existedUser,
    totalPage: Math.ceil(total / size),
    activePage: page,
  };
};
const UpdateOne = async (id, updateData) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { $set: updateData }, // Chỉ cập nhật các trường có trong updateData
      { new: true } // Trả về đối tượng đã được cập nhật mới nhất
    ).exec();
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

export default {
  // findUserByEmail,
  findAllUsers,
  createUser,
  findAll,
  findUserById,
  UpdateOne,
  findUserByEmail,
};
