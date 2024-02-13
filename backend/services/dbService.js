import mongoose from "mongoose";
import { config } from "dotenv";
require("dotenv").config();
import Counter from "../models/Counter";

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
  async createInitialCounter() {
    try {
      const existingCounter = await Counter.findById("issueId");
      if (!existingCounter) {
        // Create the initial counter document
        await Counter.create({ _id: "issueId", seq: 1 });
        console.log("Initial counter document created.");
      } else {
        console.log("Counter document already exists.");
      }
    } catch (error) {
      console.error("Error creating initial counter:", error);
    }
  }
}

const dbService = new DBService();

// Call the method during application startup
(async () => {
  try {
    await dbService.isConnected();
    await dbService.createInitialCounter();
    // Other initialization steps for your application
  } catch (error) {
    console.error("Error checking database connection:", error);
    // Handle the error appropriately
  }
})();

export default dbService;
