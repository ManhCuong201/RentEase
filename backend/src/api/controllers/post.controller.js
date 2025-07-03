import userRepository from "../repositories/user.repository.js";
import { postService, userService } from "../services/index.js";

// Lấy post detail
const getPostDetailById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postDetail = await postService.getPostDetailById(id);
    if (!postDetail) {
      return res.status(404).json({ message: "post not found" });
    }
    return res.status(200).json(postDetail);
  } catch (error) {
    next(error);
  }
};

// Lấy post detail on map
const getPostDetailOnMap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postDetail = await postService.getPostDetailOnMapById(id);
    if (!postDetail) {
      return res.status(404).json({ message: "post not found" });
    }
    return res.status(200).json(postDetail);
  } catch (error) {
    next(error);
  }
};

// Lấy ra services
const getAllServices = async (req, res) => {
  try {
    const services = await postService.getAllServices();
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "Services not found" });
    }
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

// Lấy ra furnitures
const getAllFurnitures = async (req, res) => {
  try {
    const furnitures = await postService.getAllFurnitures();
    if (!furnitures || furnitures.length === 0) {
      return res.status(404).json({ message: "Furnitures not found" });
    }
    return res.status(200).json(furnitures);
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
    });
  }
};

// Lấy all post on Map
const getAllpostOnMap = async (req, res) => {
  try {
    const posts = await postService.getAllpostOnMap();
    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No posts found" });
    }
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      content: error?.message || error,
    });
  }
};

// Lấy all post
const getAllpostInfo = async (req, res) => {
  try {
    const posts = await postService.getAllpost();
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      content: error?.message || error,
    });
  }
};

const searchpost = async (req, res) => {
  try {
    const posts = await postService.getPostsBySearch(req.body);
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      content: error?.message || error,
    });
  }
};

const getPostsByOwner = async (req, res) => {
  const { searchText, status, userId } = req.query;

  try {
    const posts = await postService.findAllPostsByUser(
      userId,
      searchText,
      status
    );

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//lay all post trên map theo owner
const getAllpostOnMapByOwner = async (req, res) => {
  try {
    const { userId, status, searchText } = req.query;
    const posts = await postService.getAllpostOnMapByOwner(
      userId,
      status,
      searchText
    );
    // if (!posts || posts.length === 0) {
    //   return res.status(404).json({ message: "No posts found" });
    // }
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      content: error?.message || error,
    });
  }
};

const create = async (req, res, next) => {
  try {
    const data = req.body;

    const createdPost = await postService.createPost(data);
    res.status(201).json({
      message: "Bài viết đã được tạo thành công!",
      post: createdPost,
    });
  } catch (error) {
    next(error);
  }
};

const getPostDetailToEdit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await postService.getPostDetailToEdit(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const dataUpdated = await postService.updatePost(id, data);

    res.status(200).json({
      post: dataUpdated,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await postService.deletePost(id);
    res.status(200).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

//thay doi status
const changeStatusPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, userId } = req.body; // Get status from the request body

    const result = await postService.changeStatusPost(id, userId, status);
    res.status(200).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

// ghim bai viet
const changePin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Get status from the request body

    const result = await postService.changePin(id, userId);
    res.status(200).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy top 5 newest pined post
const get5NewestPinnedPost = async (req, res) => {
  try {
    const posts = await postService.getPinnedPost();
    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No posts found" });
    }
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      content: error?.message || error,
    });
  }
};

const getLandlordInfoByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const result = await postService.getLandlordInfoByPostId(postId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getLandlordFullInfoByLandlordId = async (req, res, next) => {
  try {
    const { landlordId } = req.params;

    const result = await postService.getLandlordFullInfoByLandlordId(
      landlordId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getPostDetailById,
  getAllServices,
  getAllFurnitures,
  getAllpostOnMap,
  getAllpostInfo,
  getPostDetailOnMap,
  searchpost,
  getPostsByOwner,
  getAllpostOnMapByOwner,
  create,
  getPostDetailToEdit,
  update,
  deletePost,
  changeStatusPost,
  get5NewestPinnedPost,
  changePin,
  getLandlordInfoByPostId,
  getLandlordFullInfoByLandlordId,
};
