import express from "express";
import { postController } from "../controllers/index.js";

const postRouter = express.Router();

// Get postDetail By ID
postRouter.get("/detail/:id", postController.getPostDetailById);

// Get all post's infomation to display modal
postRouter.get("/all_post", postController.getAllpostInfo);

// Get post's location, image to display marker
postRouter.get("/on_map/detail/:id", postController.getPostDetailOnMap);

// Get all post's infomation( id, first image, location) when view on map
postRouter.get("/post-pin", postController.get5NewestPinnedPost);

// Get all post's infomation( id, first image, location) when view on map
postRouter.get("/on_map/all_post", postController.getAllpostOnMap);

//search + filter post
postRouter.post("/search_post", postController.searchpost);

postRouter.get("/post-manager", postController.getPostsByOwner);

postRouter.get("/on_map/manager", postController.getAllpostOnMapByOwner);

postRouter.post("", postController.create);

postRouter.get("/detail/edit/:id", postController.getPostDetailToEdit);

postRouter.put("/edit/:id", postController.update);

postRouter.delete("/delete/:id", postController.deletePost);

postRouter.put("/:id/status", postController.changeStatusPost);

postRouter.put("/:id/pin", postController.changePin);

postRouter.get(
  "/detail/landlord-info/:postId",
  postController.getLandlordInfoByPostId
);

postRouter.get(
  "/landlord-full-info/:landlordId",
  postController.getLandlordFullInfoByLandlordId
);

export default postRouter;
