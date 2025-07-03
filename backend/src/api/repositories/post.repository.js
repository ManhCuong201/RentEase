import Post from "../models/post.model.js";


const findAllPostByOwnerId = async (postIds, searchText, status) => {
  const filter = { _id: { $in: postIds } };

  if (searchText) {
    filter.title = { $regex: searchText, $options: "i" };
  }

  if (status) {
    filter.status = status;
  }

  const posts = await Post.find(filter, {
    _id: 1,
    title: 1,
    images: 1,
    price: 1,
    squareMeter: 1,
    pin: 1,
    address: 1,
    status: 1,
    capacity: 1,
  });

  return posts.map((post) => ({
    _id: post._id,
    title: post.title,
    images: post.images,
    price: post.price,
    address: ` ${post.address.detail}, ${post.address.ward.name}, ${post.address.district.name}, ${post.address.city.name}`,
    squareMeter: post.squareMeter,
    pin: post.pin,
    status: post.status,
    capacity: post.capacity,
  }));
};

const findAllPostOnMapByOwnerId = async (postIds, status) => {
  const filter = { _id: { $in: postIds } };

  if (status) {
    filter.status = status;
  }

  const posts = await Post.find(filter, {
    coordinate: 1,
    _id: 1,
    image: { $arrayElemAt: ["$images", 0] },
  });

  return posts;
};

export default {

  findAllPostByOwnerId,
  findAllPostOnMapByOwnerId,
};
