import Issue from "../models/Issue";
import User from "../models/User";
import dbService from "../services/dbService";
import Assignment from "../models/Assignment";
import mongoose from "mongoose";
import Category from "../models/Category";

class AssignmentsController {
  static async createAssignment(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      console.log(req.body);
      const { technician_id, issue_id, status, priority, deadline } = req.body;
      console.log("technician_id: ", technician_id);
      console.log("issue_id: ", issue_id);
      console.log("status: ", status);
      console.log("deadline: ", deadline);
      console.log("priority: ", priority);

      // Change the category_id field to category
      const { category } = req.body;
      console.log("category_id: ", category);
      // if (!technician_id || !issue_id || !status || !priority || !category)
      if (!technician_id || !issue_id || !status || !priority || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const technician = await User.findById(technician_id);
      if (!technician)
        return res.status(404).json({ error: "Technician not found" });

      const issue = await Issue.findById(issue_id);
      if (!issue) return res.status(404).json({ error: "Issue not found" });

      // Create a new assignment document
      const newAssignment = new Assignment({
        technician: technician_id,
        user: issue.user,
        issue: issue_id,
        category: issue.category._id,
        status: status,
        priority: priority,
        deadline: deadline,
      });
      console.log("created new obj: ", newAssignment);

      // Push the new assignment to the assignment_history of the issue
      issue.issue_status = status;
      issue.assignment_history.push({
        assigned_to: technician_id,
        assigned_date: newAssignment.assigned_date,
      });

      await issue.save();

      // Save the new assignment to the database
      await newAssignment.save();
      // Return a success response with the new assignment
      console.log("success: ", issue);
      return res.status(201).json({ newAssignment });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getAllAssignments(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }

      const assignments = await Assignment.find({})
        .populate("user", "user_name")
        .populate("technician", "user_name")
        .populate({
          path: "issue",
          select: "issue_id issue_message issue_status createdAt",
          options: { sort: { createdAt: -1 } },
        })
        .populate("category", "category_name")
        .sort({assigned_date: -1})
        .exec();
      return res.status(200).json({ assignments });
    } catch (error) {
      return res.status(404).json({ error: "Assignments not found" });
    }
  }

  static async getAssignmentDetails(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      const { assignmentId } = req.params;
      const assignmentResult = await Assignment.findById(assignmentId)
        .populate("user", "user_name")
        .populate("technician", "user_name")
        .populate("issue", "issue_id issue_message issue_status createdAt")
        .populate("category", "category_name")
        .exec();

      if (!assignmentResult)
        return res.status(404).json({ error: "Assignment not found" });

      const assignment = {
        id: assignmentResult._id,
        issue_id: assignmentResult.issue.issue_id,
        status: assignmentResult.status,
        priority: assignmentResult.priority,
        assigned_date: assignmentResult.assigned_date,
        issue: assignmentResult.issue.issue_message,
        reportedDate: assignmentResult.issue.createdAt,
        technician: assignmentResult.technician.user_name,
        category: assignmentResult.category.category_name,
        raiseeName: assignmentResult.user.user_name,
        messages: assignmentResult.messages,
        deadline: assignmentResult.deadline,
      };

      console.log(assignmentResult.issue);
      return res.status(200).json({ assignment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  static async getAssignmentsByTechnicianId(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      const { technicianId } = req.params;
      // console.log(technicianId);

      if (!mongoose.Types.ObjectId.isValid(technicianId)) {
        return res.status(400).json({ error: "Invalid technician id" });
      }
      if (!(await User.exists({ _id: technicianId }))) {
        return res.status(404).json({ error: "Technician not found" });
      }

      const assignments = await Assignment.find({ technician: technicianId })
        .populate([
          { path: "issue", select: "issue_id issue_message issue_status createdAt" },
          { path: "category" },
          { path: "user", select: "user_name" },
        ])
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      console.log(assignments);
      return res.status(200).json({ assignments });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async updateAssignment(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      const { assignmentId } = req.params;
      const { status, priority, deadline, messages, resolved_date } = req.body;

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment)
        return res.status(404).json({ error: "Assignment not found" });

      if (status) {
        assignment.status = status;
        const issue = await Issue.findById(assignment.issue);
        // Update issue status based on assignment status mapping
        if (assignment.status === "completed") issue.issue_status = "resolved";
        if (resolved_date) {
          issue.resolved_date = new Date(resolved_date);
          assignment.resolved_date = new Date(resolved_date);
        }

        await issue.save();
      }
      if (priority) assignment.priority = priority;
      if (deadline) assignment.deadline = deadline;
      if (messages) assignment.messages.push(...messages);
      console.log(assignment);

      await assignment.save();

      const updatedAssignment = await Assignment.findById(assignmentId);
      return res.status(200).json({ assignment: updatedAssignment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async getIssueAssignments(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      const { issueId } = req.params;
      const assignments = await Assignment.find({ issue_id: issueId });

      return res.status(200).json({ assignments });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default AssignmentsController;
