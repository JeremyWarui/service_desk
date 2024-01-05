import Category from "../models/Category";
import dbService from "../services/dbService";

class CategoriesController {
  static async createCategory(req, res) {
    try {
        // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const { category_name } = req.body;

      if (!category_name) return res.status(400).json({ error: "Missing category name" });

      const existingCategory = await Category.findOne({ category_name });
      if (existingCategory) return res.status(409).json({ error: "Category already exists" });

      const newCategory = new Category({ category_name });
      await newCategory.save();

      return res.status(201).json({ category: newCategory });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getAllCategories(req, res) {
    try {
        // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const categories = await Category.find();
      return res.status(200).json({ categories });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getCategory(req, res) {
    try {
        // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);

      if (!category) return res.status(404).json({ error: "Category not found" });

      return res.status(200).json({ category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }


  static async getDefaultCategories() {
    return [
      { name: "Plumbing" },
      { name: "Carpentry & Masonry" },
      { name: "Electrical" },
    ];
  }
}

export default CategoriesController;