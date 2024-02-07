import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dbService from "../services/dbService";

class AuthController {
  static async connectUser(req, res) {
    try {
      const { user_name, password } = req.body;
      console.log("req body: ", req.body);
      // Validate user input (e.g., check for empty fields)
      if (!user_name || !password)
        return res.status(401).json({ error: "Unauthorized" });
      // Find the user by username
      const user = await User.findOne({ user_name });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // Compare passwords using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const secret = process.env.TOKEN_SECRET;

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, user_role: user.user_role },
        secret,
        { expiresIn: "2m" } // Increase expiration to 24 hours
      );

      console.log({ user, token: token });

      return res.json({ message: "Login successful", token, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Login failed" });
    }
  }

  static async registerUser(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      const { user_name, email, password, user_role, category } = req.body;

      if (!user_name)
        return res.status(400).json({ error: "Missing username" });
      if (!email) return res.status(400).json({ error: "Missing email" });
      if (!password) return res.status(400).json({ error: "Missing password" });
      if (!user_role)
        return res.status(400).json({ error: "Missing user role" });
      if (user_role === "technician" && !category)
        return res
          .status(400)
          .json({ error: "Missing category for technician" });
      // Check for existing user with the same username or email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      // Hash password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Create new user
      const user = new User({
        user_name,
        email,
        password: hashedPassword,
        user_role,
      });
      // Handle category for technicians
      if (user_role === "technician") {
        if (!category) {
          return res
            .status(400)
            .json({ message: "Category is required for technicians" });
        }
        user.category = category;
      }
      await user.save();
      console.log(user);
      return res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Registration failed" });
    }
  }

  static async isAuthenticated(req, res, next) {
    try {
      const token = (req.headers.authorization || "").split(" ")[1];
      if (!token) res.status(401).json({ message: "Missing authorization token" });

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  }
}

export default AuthController;
