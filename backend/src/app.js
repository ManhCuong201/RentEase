import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { handleBadRequest, handleNotFound, handleServerErrors, logRequestTime, } from "./api/middlewares/index.js";
import instanceMongoDb from "./api/database/connect.mongodb.js";
import jwt from "jsonwebtoken";
import router from "./api/routes/index.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import "./api/config/firebaseAdmin.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "5mb" })); // Đặt kích thước tối đa là 5MB
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.set("json replacer", (key, value) => {
  if (typeof value === "object" && value !== null) {
    return JSON.parse(JSON.stringify(value));
  }
  return value;
});

// Đừng xóa phần dưới này
// const server = http.createServer(app);
// const socketIo = new Server(server, {
//     cors: {
//         origin: ["http://localhost:8081"],
//         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//         credentials: true, // Enable credentials (important for cookies and authentication)
//     },
// });
// app.use(cors({
//     origin: ["http://localhost:8081"],
//     methods: "GET, POST, PUT, DELETE, OPTIONS",
// }))

const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:3000", // Thêm cổng 3000
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Nếu không có origin (ví dụ: khi gọi từ Postman), cho phép
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api", router);

// Sử dụng các middleware xử lý lỗi
app.use(handleBadRequest);
app.use(handleNotFound);
app.use(handleServerErrors);

export default app;
