import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import dbService from "../services/dbService";
import Category from "../models/Category";
import jwt from "jsonwebtoken";

class UsersController {
  static async createUser(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const { userName, email, role } = req.body;

      // Validation
      if (!userName) return res.status(400).json({ error: "Missing username" });
      if (!email) return res.status(400).json({ error: "Missing email" });
      if (!role) return res.status(400).json({ error: "Missing user role" });

      // Handle technician category
      if (role === "technician" && req.body.category) {
        const { _id: categoryId } = await Category.findOne({
          category_name: req.body.category,
        });
        if (!categoryId) {
          return res.status(400).json({ error: "Invalid category provided" });
        }

        const technician = await User.create({
          user_name: userName,
          email: email,
          user_role: role,
          category: categoryId, // Extracted ID
        });
        return res.status(201).json({ technician });
      } else if (role === "technician" && !req.body.category) {
        return res
          .status(400)
          .json({ error: "Missing category for technician user" });
      }

      // Create user for other roles
      if (role !== "technician") {
        const user = await User.create({
          user_name: userName,
          email: email,
          user_role: role,
        });
        return res.status(201).json({ user });
      }

      return res.status(201).json({ User }); // Return created user object
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getUsers(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const users = await User.find({}); // Use Mongoose find method

      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getUser(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const userId = req.params.id;
      const user = await User.findById(userId); // Use Mongoose findById method

      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getMe(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);                                                                    
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      console.log(user);

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user information:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getUserByUserName(userName) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        throw new Error("Database connection unavailable.");
      }
      // Find user by username using Mongoose's findOne method
      const user = await User.findOne({ user_name: userName });
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      throw new Error("Failed tor retrieve user");
    }
  }

  static async updateUser(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ error: "User not found" });

      // Update user details based on request body
      await user.updateOne(req.body); // Use Mongoose updateOne method

      // Re-fetch user data with updated fields
      const updatedUser = await User.findById(userId);

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default UsersController;
