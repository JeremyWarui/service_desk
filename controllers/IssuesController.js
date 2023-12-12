import { models } from "../services/dbService";
import { v4 as uuidv4 } from "uuid";
const { Issue, Category } = models;

class IssuesController {
  static async createNewIssue(req, res) {
    const { issue, category } = req.body;
    const userId = req.params;

    if (!userId) return res.status(404).json({ error: "User not found" });

    if (!issue || !category)
      return res.status(400).json({ error: "Must add an issue and category" });

    const foundCategory = await Category.find({ where: { name: category } });

    if (!foundCategory)
      return res.status(404).json({ error: "Category not found" });

    const newIssue = await Issue.create({
      id: uuidv4(),
      category_id: foundCategory.id,
      issue_message: issue,
      issue_status: "open",
      issue_date: new Date(),
      user_id: userId,
    });

    return res.status(201).json({ issue: newIssue });
  }

  static async updateIssueAssignment(req, res) {
    const { technicianId } = req.body;
    const { issueId } = req.params;

    try {
      const issue = await Issue.findByPk(issueId);
      if (!issue) return res.status(404).json({ error: "Issue not found" });

      const technician = await User.findByPk(technicianId);
      if (!technician)
        return res.status(404).json({ error: "No technician found" });

      await issue.update({
        issue_assignment: "assigned",
        assigned_to: technician.id,
      });

      return res.status(200).json({ issue });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateIssueStatus(req, res) {
    const { issueId } = req.params;

    try {
      const issue = await Issue.findByPk(issueId);
      if (!issue) return res.status(404).json({ error: "Issue not found" });

      const assignee = await issue.getAssignee();

      if (!assignee)
        return res.status(404).json({ error: "Assignee not found" });

      if (assignee.user_role !== "technician")
        return res.status(403).json({ error: "You are not a technician" });

      await issue.update({
        issue_status: "resolved",
        resolved_date: new Date(),
      });

      return res.status(200).json({ issue });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async displayIssuesByUser(req, res) {
    const { userId } = req.params;

    if (!userId) return res.status(404).json({ error: "User not found" });
    const issues = await Issue.findAll({ where: { user_id: userId } });
    return res.status(200).json({ issues });
  }

  static async getAllissues(req, res) {
    const issues = Issue.findAll();
    return res.status(200).json({ issues });
  }
}

export default IssuesController;
