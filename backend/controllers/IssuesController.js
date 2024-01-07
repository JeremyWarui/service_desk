import Issue from "../models/Issue";
import User from "../models/User";
import Category from "../models/Category";
import dbService from "../services/dbService";

class IssuesController {
  static async createNewIssue(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const { category_id, issue_message, user_id, issue_status } = req.body;

      const validationErrors = [];
      if (!category_id) validationErrors.push("Missing category");
      if (!issue_message) validationErrors.push("Missing issue message");
      if (!user_id) validationErrors.push("Missing user");
      if (
        !issue_status ||
        !["open", "in-progress", "resolved", "closed"].includes(issue_status)
      )
        validationErrors.push("Invalid issue status");

      if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(", ") });
      }

      const user = await User.findById(user_id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const category = await Category.findById(category_id);
      if (!category)
        return res.status(404).json({ error: "Category not found" });

      const newIssue = new Issue({
        category_id,
        issue_message,
        user_id,
        issue_status,
        open_date: Date.now(),
      });

      await newIssue.save();

      return res.status(201).json({
        issue: {
          ...newIssue.toObject(),
          user: await User.findById(newIssue.user_id),
          category: await Category.findById(newIssue.category_id),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getAllIssues(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const issues = await Issue.find({}).populate("user").populate("category");

      return res.status(200).json({ issues });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getIssue(req, res) {
    try {
      // Check database connection
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
  
      const issueId = req.params.id;
      // Find the issue and populate necessary fields
      const issue = await Issue.findById(issueId)
        .populate([
          { path: "user", select: "user_name email user_role" },
          { path: "category", select: "category_name" }, // Use category instead of category_id
          { path: "assignment_history.assigned_to", select: "user_name" },
        ])
        .exec();
  
      // Validate and access data
      if (!issue) {
        return res.status(404).json({ error: "Issue not found" });
      }
  
      const categoryName = issue.category?.category_name; // Use category instead of category_id
      if (!categoryName) {
        return res.status(400).json({ error: "Category name not found" });
      }
      // Get technicians with matching category
      const technicians = await User.find({
        user_role: "technician",
        category: issue.category, // Use category instead of category_id
      })
        .select("user_name email user_role") // Select only necessary fields
        .exec()
      // Handle unassigned issues
      let assignedPerson = "";
      if (issue.assignment_history && issue.assignment_history.length > 0) {
        assignedPerson = issue.assignment_history[0].assigned_to.user_name;
      }
  
      // Return the issue object, the assigned person, the category name, and the list of technicians in the response
      return res.status(200).json({ issue, assignedPerson, categoryName, technicians });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  

  static async updateIssue(req, res) {
    try {
      const issueId = req.params.id;
      const issue = await Issue.findById(issueId);

      if (!issue) return res.status(404).json({ error: "Issue not found" });

      const validUpdates = [
        "issue_message",
        "issue_status",
        "issue_resolution",
      ];
      const updateData = {};
      for (const key in req.body) {
        if (validUpdates.includes(key)) updateData[key] = req.body[key];
      }

      if (
        updateData.issue_status &&
        !["open", "in-progress", "resolved", "closed"].includes(
          updateData.issue_status
        )
      ) {
        return res.status(400).json({ error: "Invalid issue status" });
      }

      await issue.updateOne(updateData);

      const updatedIssue = await Issue.findById(issueId)
        .populate("user")
        .populate("category");

      return res.status(200).json({ issue: updatedIssue });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async deleteIssue(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const issueId = req.params.id;
      const issue = await Issue.findById(issueId);

      if (!issue) return res.status(404).json({ error: "Issue not found" });

      await issue.deleteOne();

      return res.status(204).json({ message: "Issue deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getIssuesByUser(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const userId = req.params.id;
      const issues = await Issue.find({ user_id: userId });
      console.log(issues.length);

      return res.status(200).json({ issues });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getIssuesByCategory(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const categoryId = req.params.id;
      const issues = await Issue.find({ category_id: categoryId });

      return res.status(200).json({ issues });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async searchIssues(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const { keywords } = req.query;
      const searchQuery = {
        $or: [
          { issue_message: { $regex: keywords, $options: "i" } },
          {
            category: {
              $elemMatch: { name: { $regex: keywords, $options: "i" } },
            },
          },
        ],
      };

      const issues = await Issue.find(searchQuery)
        .populate("user")
        .populate("category");

      return res.status(200).json({ issues });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default IssuesController;
