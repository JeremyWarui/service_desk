import Issue from "../models/Issue";
import User from "../models/User";
import dbService from "../services/dbService";
import Assignment from "../models/Assignment";

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

      if (!technician_id || !issue_id || !status || !priority) {
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

      if (status) assignment.status = status;
      if (priority) assignment.priority = priority;
      if (deadline) assignment.deadline = deadline;
      if (messages) assignment.messages.push(...messages);

      await assignment.updateOne({});

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

  static async getAssignmentDetails(req, res) {
    try {
      // Check database connection before proceeding
      if (!(await dbService.isConnected())) {
        return res
          .status(500)
          .json({ error: "Database connection unavailable." });
      }
      const { issueId, assignmentId } = req.params;
      const assignment = await Assignment.findOne({
        issue_id: issueId,
        _id: assignmentId,
      });

      if (!assignment)
        return res.status(404).json({ error: "Assignment not found" });

      return res.status(200).json({ assignment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default AssignmentsController;
