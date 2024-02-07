import express from "express";
import AppController from "../controllers/AppController";
import UsersController from "../controllers/UsersController";
import IssuesController from "../controllers/IssuesController";
import CategoriesController from "../controllers/CategoriesController";
import AssignmentsController from "../controllers/AssignmentsController";
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.get("/", AppController.getHomepage);

//login and signUp
router.post("/connect", AuthController.connectUser);
router.post("/register", AuthController.registerUser);

// Users
router.post("/user", UsersController.createUser);
router.get("/users", 
// AuthController.isAuthenticated,
UsersController.getUsers);
router.get("/users", UsersController.getUsers);
router.get("/users/:id", UsersController.getUser);
router.get("/me", AuthController.isAuthenticated, UsersController.getMe);
router.patch("/user/me", 
// AuthController.isAuthenticated,
UsersController.updateUser
);

// Categories
router.get("/categories", CategoriesController.getAllCategories);
router.post("/categories", CategoriesController.createCategory);
router.get("/categories/:id", CategoriesController.getCategory);

// Issues
router.post('/issues', 
// AuthController.isAuthenticated,
IssuesController.createNewIssue);
router.get("/issues", IssuesController.getAllIssues);
router.get("/issues/:id", IssuesController.getIssue);
router.patch('/issues/:id',
// AuthController.isAuthenticated, 
IssuesController.updateIssue);
router.delete('/issues/:id', 
// AuthController.isAuthenticated, 
IssuesController.deleteIssue);
router.get("/users/:id/issues", IssuesController.getIssuesByUser);
router.get("/categories/:id/issues", IssuesController.getIssuesByCategory);
router.get("/issues/search", IssuesController.searchIssues);
router.get("/open-issues/", IssuesController.getAllUnassignedIssues);

// // Assignments
router.post('/issues/:issueId/assignments',
// AuthController.isAuthenticated, 
AssignmentsController.createAssignment);
router.get("/issues/:issueId/assignments", AssignmentsController.getIssueAssignments);
router.get("/assignments",AssignmentsController.getAllAssignments);
router.get("/assignments/:assignmentId",AssignmentsController.getAssignmentDetails);

router.get("/techAssignments/:technicianId",
// AuthController.isAuthenticated,
AssignmentsController.getAssignmentsByTechnicianId);
router.patch('/techAssignments/:assignmentId', 
// AuthController.isAuthenticated, 
AssignmentsController.updateAssignment);

export default router;
