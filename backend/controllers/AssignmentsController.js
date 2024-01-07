import Issue from "../models/Issue";
import User from "../models/User";
import dbService from "../services/dbService";
import Assignment from "../models/Assignment";
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
      const { technician_id, issue_id, status, priority, deadline } = req.body;

      // Change the category_id field to category
      const { category } = req.body;

      if (!technician_id || !issue_id || !status || !priority || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const technician = await User.findById(technician_id);
      if (!technician)
        return res.status(404).json({ error: "Technician not found" });

      const issue = await Issue.findById(issue_id);
      if (!issue) return res.status(404).json({ error: "Issue not found" });

      const newAssignmentHistory = {
        assigned_to: technician._id,
        assigned_date: Date.now(),
      };

      issue.assignment_history.push(newAssignmentHistory);

      // Change the technician field to assignedPerson
      issue.assignedPerson = {
        technician: technician._id,
        assigned_date: Date.now(),
      };

      issue.issue_status = "in-progress";

      await issue.save();

      const newAssignment = new Assignment({
        technician_id,
        issue_id,
        status,
        priority,
        deadline,
      });

      await newAssignment.save();

      return res.status(201).json({ assignment: newAssignment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
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
        .populate("technician", "user_name")
        .populate("issue", "issue_message issue_status")
        .populate("category", "category_name")
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
      const assignment = await Assignment.findById(assignmentId)
        .populate("technician", "user_name")
        .populate("issue", "issue_message issue_status")
        .populate("category", "category_name")
        .exec();

      if (!assignment)
        return res.status(404).json({ error: "Assignment not found" });

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

      const techniciansTasksAssigned = await Assignment.find({
        technician_id: req.params.id,
      });
      if (techniciansTasksAssigned)
        return res.status(200).json({ techniciansTasksAssigned });
      return res.status(404).json({ error: "No tasks found for technician" });
    } catch (error) {
      return res.status(404).json({ error: "Assignments not found" });
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
      const { status, priority, deadline, messages } = req.body;

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment)
        return res.status(404).json({ error: "Assignment not found" });

      if (status) {
        assignment.status = status;
        const issue = await Issue.findById(assignment.issue_id);
        // Update issue status based on assignment status mapping
        if (status === "completed") {
          issue.status = "resolved";
          issue.resolved_date = new Date();
        }
        // update the issue
        issue.issue_status = status;
        console.log(issue);

        await issue.save();
      }
      if (priority) assignment.priority = priority;
      if (deadline) assignment.deadline = deadline;
      if (messages) assignment.messages.push(...messages);

      await assignment.save();

      const updatedAssignment = await Assignment.findById(assignmentId);
      console.log(updatedAssignment);

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

  // static async getAssignmentDetails(req, res) {
  //   try {
  //     // Check database connection before proceeding
  //     if (!(await dbService.isConnected())) {
  //       return res
  //         .status(500)
  //         .json({ error: "Database connection unavailable." });
  //     }
  //     const { issueId, assignmentId } = req.params;
  //     const assignment = await Assignment.findOne({
  //       issue_id: issueId,
  //       _id: assignmentId,
  //     });

  //     if (!assignment)
  //       return res.status(404).json({ error: "Assignment not found" });

  //     return res.status(200).json({ assignment });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: "Something went wrong" });
  //   }
  // }
}

export default AssignmentsController;
