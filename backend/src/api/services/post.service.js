import { postRepository } from "../repositories/index.js";
import Furniture from "../models/furniture.model.js";
import Service from "../models/service.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import imageService from "./image.service.js";
import { ObjectId } from "mongodb";

// Lấy ra post detail cho phần view post detail (lấy tất cả thông tin)
const getPostDetailById = async (id) => {
  const post = await Post.findById(id).lean();
  if (!post) return null;

  const { city, district, ward, detail } = post.address;
  return {
    ...post,
    address: `${city.name}, ${district.name}, ${ward.name}, ${detail}`,
  };
};

// Lấy ra post detail cho phần view post detail Modal trong On map (lấy ra title, id, địa chỉ, tọa độ, ảnh đầu)
const getPostDetailOnMapById = async (id) => {
  const post = await Post.findById(id, {
    title: 1,
    coordinate: 1,
    price: 1,
    _id: 1,
    address: 1,
    image: { $arrayElemAt: ["$images", 0] },
  }).lean();
  const { city, district, ward, detail } = post.address;
  return {
    ...post,
    address: `${city.name}, ${district.name}, ${ward.name}, ${detail}`,
  };
};

// Lấy rả tất cả nội thất
const getAllFurnitures = async () => {
  return await Furniture.find();
};

// Lấy ra tất cả dịch vụ
const getAllServices = async () => {
  return await Service.find();
};

// Lấy ra tất cả phòng với thông tin cụ thể như ảnh , id, location
const getAllpostOnMap = async () => {
  const posts = await Post.aggregate([
    {
      $match: { status: "public" },
    },
    {
      $project: {
        coordinate: 1,
        _id: 1,
        image: { $arrayElemAt: ["$images", 0] },
      },
    },
  ]);
  return posts;
};

const getPostsBySearch = async (data) => {
  try {
    const {
      searchKey,
      numberOfpost,
      furniture,
      service,
      orderBy,
      priceRange,
      cityId,
    } = data;

    // Base query with search on title or description, and optional furniture/service filters
    const query = {
      $or: [
        { description: { $regex: searchKey || "", $options: "i" } },
        { title: { $regex: searchKey || "", $options: "i" } },
      ],
      ...(furniture &&
        furniture.length > 0 && {
          furnitures: { $all: furniture.map((id) => new ObjectId(id)) },
        }),
      ...(service &&
        service.length > 0 && {
          services: { $all: service.map((id) => new ObjectId(id)) },
        }),
      ...(cityId && { "address.city.id": cityId }), // Filter for cityId
      status: "public", // Filter for status
    };

    // Apply price range filter based on priceRange value
    if (priceRange === "under1m") {
      query.price = { $lt: 1000000 };
    } else if (priceRange === "1to3m") {
      query.price = { $gte: 1000000, $lte: 3000000 };
    } else if (priceRange === "above3m") {
      query.price = { $gt: 3000000 };
    }

    // Define sorting based on orderBy value
    let sort = {
      pin: -1, // Ensure pinned items are shown first
      ...(orderBy === "priceUp" && { price: 1 }), // Ascending order
      ...(orderBy === "priceDown" && { price: -1 }), // Descending order
      ...(orderBy === "title" && { title: 1 }),
      ...(orderBy !== "priceUp" &&
        orderBy !== "priceDown" &&
        orderBy !== "title" && { _id: 1 }),
    };

    // Set default value for numberOfpost if it's not a valid number
    // const limitPosts = typeof numberOfpost === "number" && numberOfpost > 0 ? numberOfpost : 8;
    const limitPosts = 99;

    // Execute the query with sorting and limit for numberOfpost
    return await Post.aggregate([
      { $match: query }, // Filtering based on the query
      { $sort: sort }, // Sorting the results
      { $limit: limitPosts }, // Limit the number of posts
      {
        $project: {
          pin: 1,
          _id: 1,
          title: 1, // Lấy tên phòng
          price: 1, // Lấy giá phòng
          capacity: 1,
          squareMeter: 1,
          address: {
            $concat: [
              { $ifNull: ["$address.city.name", ""] },
              ", ",
              { $ifNull: ["$address.district.name", ""] },
              ", ",
              { $ifNull: ["$address.ward.name", ""] },
              ", ",
              { $ifNull: ["$address.detail", ""] },
            ],
          }, // Định dạng lại địa chỉ
          image: { $arrayElemAt: ["$images", 0] }, // Lấy ảnh đầu tiên từ mảng ảnh
        },
      },
    ]);
  } catch (error) {
    return {
      message: "Error",
      content: error.toString(),
    };
  }
};

const findAllPostsByUser = async (userId, searchText, status) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const posts = await postRepository.findAllPostByOwnerId(
    user.postIds,
    searchText,
    status
  );

  return posts;
};

//lay tren map theo user
const getAllpostOnMapByOwner = async (userId, status) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  try {
    return await postRepository.findAllPostOnMapByOwnerId(user.postIds, status);
  } catch (error) {
    return {
      message: "Error",
      content: error.toString(),
    };
  }
};

const createPost = async (data) => {
  const userId = data.userId;
  const user = await User.findById(userId);

  if (!user && user.role !== "landlord") {
    throw new Error("User not found or not permis to create post!");
  }

  const validServices = await Service.find({
    _id: { $in: data.services },
  }).select("_id");

  // Kiểm tra và lấy các furnitures hợp lệ
  const validFurnitures = await Furniture.find({
    _id: { $in: data.furnitures },
  }).select("_id");

  const imageFiles = data.images;

  // Kiểm tra kích thước của các tệp hình ảnh
  // imageFiles.forEach((image, index) => {
  //   console.log(
  //     `Kích thước tệp hình ảnh ${index + 1}: ${Buffer.byteLength(
  //       image.uri,
  //       "base64"
  //     )} bytes`
  //   );
  // });

  const uploadedFiles = await imageService.uploadImages(imageFiles);

  // console.log(uploadedFiles);

  // Tạo bài đăng mới
  const newPost = new Post({
    title: data.title,
    price: data.price,
    squareMeter: data.squareMeter,
    phoneNumber: data.phoneNumber,
    images: uploadedFiles.map((file) => file.url), // Chỉ lưu trữ URL
    capacity: data.capacity,
    description: data.description,
    estimatedCosts: data.estimatedCosts,
    address: data.address,
    coordinate: data.coordinate,
    furnitures: validFurnitures.map((furniture) => furniture._id),
    services: validServices.map((service) => service._id),
    status: data.status,
  });

  // console.log(newPost);

  // Lưu bài đăng vào cơ sở dữ liệu
  const savedPost = await newPost.save();

  // console.log("savedPost");

  // Cập nhật postId vào user
  user.postIds.push(savedPost._id);
  await user.save(); // Lưu thay đổi vào người dùng

  return savedPost; // Trả về bài đăng vừa được tạo
};

const getPostDetailToEdit = async (id) => {
  const post = await Post.findById(id).lean();
  if (!post || post.status !== "draft") {
    throw new Error("Post not found or is public!");
  }

  // Convert mongoose document thành plain object
  const updatedPost = {
    ...post,
    images: post.images.map((imageUrl) => ({
      fileName:
        decodeURIComponent(imageUrl).split("/images/")[1]?.split("?")[0] ||
        null,
      uri: imageUrl,
    })),
  };

  return updatedPost;
};

const updatePost = async (id, data) => {
  try {
    // Find the existing post
    const post = await Post.findById(id);
    if (!post || post.status !== "draft") {
      throw new Error("Post not found or is public!");
    }

    // Sao chép các URL ảnh hiện có
    let updatedImageUrls = [...post.images];

    if (data.images && data.images.length > 0) {
      // Tách biệt các URL từ store và hình ảnh base64
      const newImages = data.images.filter((image) => image.base64);
      const existingImages = data.images.filter((image) => !image.base64);

      // Tập hợp các URL của các hình ảnh cần giữ lại từ `data.images`
      const imagesToKeep = new Set(existingImages.map((image) => image.uri));

      // Xác định hình ảnh cần xóa (chỉ xóa những URL không nằm trong `imagesToKeep`)
      const imagesToDelete = post.images.filter(
        (uri) => !imagesToKeep.has(uri)
      );

      // Delete removed images from Firebase
      if (imagesToDelete.length > 0) {
        await imageService.deleteFilesFromFirebaseStorage(imagesToDelete);
        // Remove deleted image URLs from the updated list
        updatedImageUrls = updatedImageUrls.filter(
          (uri) => !imagesToDelete.includes(uri)
        );
      }

      // Upload new images
      if (newImages.length > 0) {
        const uploadedFiles = await imageService.uploadImages(newImages);
        // Add new image URLs to the list

        updatedImageUrls = [
          ...updatedImageUrls,
          ...uploadedFiles.map((file) => file.url),
        ];
      }
    }

    // Handle other data updates
    const validServices = data.services
      ? await Service.find({ _id: { $in: data.services } }).select("_id")
      : post.services;

    const validFurnitures = data.furnitures
      ? await Furniture.find({ _id: { $in: data.furnitures } }).select("_id")
      : post.furnitures;

    // Update post with new data

    const updateData = {
      ...data,
      images: updatedImageUrls,
      services: validServices.map((service) => service._id),
      furnitures: validFurnitures.map((furniture) => furniture._id),
    };

    // Remove base64 data from images to avoid storing it in the database
    if (updateData.images) {
      updateData.images = updatedImageUrls;
    }

    // Update post in database
    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return updatedPost;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (id) => {
  const post = await Post.findById(id);

  if (!post || post.status !== "draft") {
    throw new Error("Post not found or is public!");
  }

  const user = await User.findOne({ postIds: id });

  if (!user || user.role !== "landlord") {
    throw new Error(
      "User not found or does not have permission to do this action!"
    );
  }

  // Nếu tìm thấy người dùng, xóa postId ra khỏi danh sách postIds của họ
  if (user) {
    user.postIds = user.postIds.filter((postId) => postId.toString() !== id);
    await user.save();
  }

  // Xóa ảnh liên kết với bài viết
  if (post.images && post.images.length > 0) {
    await imageService.deleteFilesFromFirebaseStorage(post.images);
  }

  // Sau khi xóa ảnh, xóa bài viết khỏi cơ sở dữ liệu
  await Post.findByIdAndDelete(id);

  return { message: "Post and associated images deleted successfully!" };
};

// Change post status function
const changeStatusPost = async (id, userId, status) => {
  // Find the user who is making the request
  const user = await User.findById(userId);
  if (!user || user.role === "tenant") {
    throw new Error(
      "User not found or does not have permission to change the post status!"
    );
  }

  // Check if the user owns the post
  if (!user.postIds.includes(id)) {
    throw new Error("You are not the owner of this post!");
  }

  // Find the post and ensure it exists
  const post = await Post.findById(id);
  if (!post || (post.status === "banned" && user.role !== "admin")) {
    throw new Error("Post not found or its status cannot be changed!");
  }

  // Update the status and pin if necessary
  let result;
  if (post.status === "public" && post.pin === true) {
    result = await Post.findByIdAndUpdate(
      id,
      { status: status, pin: false }, // Update both status and pin
      { new: true } // Return the updated post
    );

    await User.findByIdAndUpdate(
      userId,
      { $inc: { "package.pinRemaind": +1 } },
      { new: true }
    );
  } else {
    result = await Post.findByIdAndUpdate(
      id,
      { status: status }, // Only update status
      { new: true }
    );
  }

  // Ensure the update was successful
  if (!result) {
    throw new Error("Failed to update the post status!");
  }

  return {
    message: `Post '${result.title}' was changed to '${status}' successfully`,
  };
};

const changePin = async (id, userId) => {
  const user = await User.findById(userId);

  if (!user || user.role === "tenant") {
    throw new Error("User not found or not permitted to do this action!");
  }

  if (!user.postIds.includes(id)) {
    throw new Error("You are not the owner of this post!");
  }

  const post = await Post.findById(id);

  if (post.status !== "public" && post.pin === false) {
    throw new Error("Post not public to be pinned!");
  }

  if (!post.pin) {
    if (user.package.pinRemaind === 0) {
      throw new Error("Bạn đã hết lượt đẩy tin!");
    }

    if (!user.package.Vip) {
      throw new Error("You are not a VIP user!");
    }
  }

  const result = await Post.findByIdAndUpdate(
    id,
    { pin: !post.pin },
    { new: true }
  );
  if (!result) {
    throw new Error("Failed to update the post status!");
  }

  // Determine the change in pinRemaind
  const pinChange = result.pin ? -1 : 1;

  await User.findByIdAndUpdate(
    userId,
    { $inc: { "package.pinRemaind": pinChange } },
    { new: true }
  );

  return {
    message: `Post ${result.title} was ${
      result.pin ? "pinned" : "unpinned"
    } successfully!`,
  };
};

// Lấy ra tất cẩ các post (Tất cả thông tin của tất cả các phòng)
const getAllpost = async () => {
  const posts = await Post.aggregate([
    {
      $sort: { _id: -1 }, // Sắp xếp theo _id mới nhất
    },
    {
      $project: {
        _id: 1,
        title: 1, // Lấy tên phòng
        price: 1, // Lấy giá phòng
        address: {
          $concat: [
            { $ifNull: ["$address.city.name", ""] },
            ", ",
            { $ifNull: ["$address.district.name", ""] },
            ", ",
            { $ifNull: ["$address.ward.name", ""] },
            ", ",
            { $ifNull: ["$address.detail", ""] },
          ],
        }, // Định dạng lại địa chỉ
        image: { $arrayElemAt: ["$images", 0] }, // Lấy ảnh đầu tiên từ mảng ảnh
      },
    },
  ]);
  return posts;
};

const getPinnedPost = async () => {
  const posts = await Post.aggregate([
    {
      $match: { pin: true, status: "public" },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        pin: 1,
        _id: 1,
        title: 1, // Lấy tên phòng
        price: 1, // Lấy giá phòng
        capacity: 1,
        squareMeter: 1,
        address: {
          $concat: [
            { $ifNull: ["$address.city.name", ""] },
            ", ",
            { $ifNull: ["$address.district.name", ""] },
            ", ",
            { $ifNull: ["$address.ward.name", ""] },
            ", ",
            { $ifNull: ["$address.detail", ""] },
          ],
        }, // Định dạng lại địa chỉ
        image: { $arrayElemAt: ["$images", 0] }, // Lấy ảnh đầu tiên từ mảng ảnh
      },
    },
  ]);
  return posts;
};

const getLandlordInfoByPostId = async (postId) => {
  const user = await User.findOne({ postIds: postId })
    .select("_id fullName") // Chỉ lấy ra _id và fullName
    .populate({
      path: "postIds",
      model: "Post",
      match: { status: "public" }, // Chỉ lấy các phòng có status là "public"
      select: "_id", // Chỉ lấy _id của các phòng
    });

  // Tính tổng số phòng có status là "public"
  const publicRoomCount = user.postIds.length;

  return {
    _id: user._id,
    fullName: user.fullName,
    publicRoomCount: publicRoomCount,
  };
};

const getLandlordFullInfoByLandlordId = async (landlordId) => {
  try {
    const user = await User.findOne({ _id: landlordId })
      .select("phoneNumber email fullName")
      .populate({
        path: "postIds",
        model: "Post",
        match: { status: "public" },
      });

    // Chuyển đổi dữ liệu bài đăng để chỉ lấy một hình ảnh đầu tiên và định dạng địa chỉ
    const posts = user.postIds.map((post) => ({
      _id: post._id,
      title: post.title,
      pin: post.pin,
      capacity: post.capacity,
      price: post.price,
      squareMeter: post.squareMeter,
      address: `${post.address.city.name}, ${post.address.district.name}, ${post.address.ward.name}, ${post.address.detail}`,
      image: post.images[0], // Chỉ lấy hình ảnh đầu tiên
    }));

    return {
      phoneNumber: user.phoneNumber,
      email: user.email,
      fullName: user.fullName,
      posts,
    };
  } catch (error) {
    console.error("Error fetching landlord info:", error);
    throw new Error("Could not fetch landlord information");
  }
};

export default {
  getPostDetailById,
  getAllFurnitures,
  getAllServices,
  getAllpostOnMap,
  getAllpost,
  getPostDetailOnMapById,
  getPostsBySearch,
  findAllPostsByUser,
  getAllpostOnMapByOwner,
  createPost,
  getPostDetailToEdit,
  updatePost,
  deletePost,
  changeStatusPost,
  getPinnedPost,
  changePin,
  getLandlordInfoByPostId,
  getLandlordFullInfoByLandlordId,
};
