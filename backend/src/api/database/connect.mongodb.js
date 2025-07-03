"use strict";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Dòng này để kết nói cloud mongo

const connectString = `mongodb+srv://${process.env.MONGO_CLOUD_USERNAME}:${process.env.MONGO_CLOUD_PASSWORD}@sdn.zi13k.mongodb.net/${process.env.MONGO_CLOUD_DB_NAME}?retryWrites=true&w=majority&appName=SDN`;

// Dòng này để kết nói local mongo
// const connectString = process.env.DB_URI;

const dbName = connectString.split("/").pop().split("?")[0];

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then(() => {
        console.log("Connected Mongodb Success");
        console.log(`Connected to MongoDB Database: ${dbName}`);
      })
      .catch((err) => {
        console.log("Error Connect: ", err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

export default instanceMongoDb;
