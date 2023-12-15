import mongoose from "mongoose";
import { config } from "dotenv";
require("dotenv").config();

class DBService {
  constructor() {
    // Replace connection string with your MongoDB URI
    mongoose.connect(process.env.DATABASE_URI);
    this.connected;

    mongoose.connection.on("connected", () => {
      console.log("Connection to MongoDB established successfully.");
      this.connected = true;
    });

    mongoose.connection.on("error", (error) => {
      console.error("Unable to connect to MongoDB:", error);
      this.connected = false;
    });
  }

  async isConnected() {
    return this.connected;
  }
}

const dbService = new DBService();
export default dbService;
