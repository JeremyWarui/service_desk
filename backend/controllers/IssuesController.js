import Issue from "../models/Issue";
import User from "../models/User";
import Category from "../models/Category";
import dbService from "../services/dbService";
import mongoose from "mongoose";

class IssuesController {
  static async createNewIssue(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      const { category, issue_message, user, issue_status = "open" } = req.body;

      const validationErrors = [];
      if (!category) validationErrors.push("Missing category");
      if (!issue_message) validationErrors.push("Missing issue message");
      if (!user) validationErrors.push("Missing user");
      if (
        !issue_status ||
        !["open", "in-progress", "resolved", "closed"].includes(issue_status)
      ) {
        validationErrors.push("Invalid issue status");
      }
      if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(", ") });
      }

      const foundUser = await User.findById(user);
      if (!foundUser) return res.status(404).json({ error: "User not found" });

      const foundCategory = await Category.findById(category);
      if (!foundCategory)
        return res.status(404).json({ error: "Category not found" });

      const newIssue = new Issue({
        category,
        issue_message,
        user,
        issue_status,
      });

      await newIssue.save();

      return res.status(201).json({
        issue: {
          ...newIssue.toObject(),
          user: await User.findById(newIssue.user),
          category: await Category.findById(newIssue.category),
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

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;
      const category = req.query.category;

      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      // Get the total number of issues
      const total = await Issue.countDocuments();

      const issues = await Issue.find({})
        .populate([
          { path: "user", select: "user_name" },
          { path: "category", select: "category_name" },
        ])
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      // Calculate the total pages
      const pages = Math.ceil(total / pageSize);
      return res.status(200).json({ issues, page, pages, total });
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
      const result = await Issue.findById(issueId, {
        _id: 1,
        issue_message: 1,
        issue_status: 1,
        assignment_history: 1,
        createdAt: 1,
        updatedAt: 1,
      })
        .populate([
          { path: "user", select: "user_name" },
          { path: "category", select: "category_name" },
          {
            path: "assignment_history.assigned_to",
            select: "user_name",
          },
        ])
        .lean()
        .orFail(new Error("Issue not found"));

      // Get the category name, raisee name, and assigned person name from the populated documents
      let assignedPerson = "";
      if (result.assignment_history && result.assignment_history.length > 0) {
        assignedPerson = result.assignment_history[0].assigned_to.user_name;
      }
      // Get the technicians who have the same category as the issue
      const technicians = await User.find(
        {
          user_role: "technician",
          category: result.category,
        },
        { user_name: 1, user_role: 1 }
      ).lean();
      // console.log(result);

      const issue = {
        id: result._id,
        issue: result,
        category: result.category.category_name,
        status: result.issue_status,
        raiseeName: result.user.user_name,
        assignedTechnician: assignedPerson,
        assignedDate: result.assignment_history[0]?.assigned_date || "",
        updateDate: result.updatedAt || "",
        techniciansList: technicians,
      };

      // console.log(issue);
      return res.status(200).json({ issue });
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

      if (!updateData.issue_message) {
        return res.status(400).json({ error: "Issue message is required" });
      }

      await issue.updateOne(updateData);

      const updatedIssue = await Issue.findById(issueId)
        .populate("user")
        .populate("category");

      return res
        .status(200)
        .json({
          issue: updatedIssue,
          updatedDate: moment(updatedIssue.updatedAt).format("DD/MM/YYYY"),
        });
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
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const issues = await Issue.find({ user: userId })
        .populate([{ path: "category" }, { path: "user", select: "user_name" }])
        .lean()
        .exec();
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
      const issues = await Issue.find({ category: categoryId });
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
