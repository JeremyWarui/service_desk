import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import dbService from "../services/dbService";

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

      // Create new user
      const user = await User.create({
        user_name: userName,
        email: email,
        user_role: role,
      });
      return res.status(201).json({ user });
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
