import express from "express";
import { userController } from "../controllers/index.js";
// import authJWT from '../middlewares/authJWT.js';
import authenticateJWT from "../middlewares/authenticateJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const userRouter = express.Router();

// Login with email and password
userRouter.post("/login", userController.login);

userRouter.post("/register", userController.register);

userRouter.get("/verify-email", userController.verifyEmail);
// Login with role admin email and password
userRouter.post("/login-admin", userController.loginAdmin);
//conver pw
userRouter.post("/hass-pw", userController.hashPasswordController);

// Route kiểm tra email
userRouter.post("/check-email-admin", userController.checkEmailAdmin);

// Route /test yêu cầu token JWT
userRouter.get(
  "/test",
  authenticateJWT,
  authorizeRoles("admin"),
  userController.FindAll
);

userRouter.get("/", userController.FindAll);

userRouter.put("/put/:id", userController.UpdateOne);

userRouter.put("/edit/:id/status", userController.updateStatus);

export default userRouter;
