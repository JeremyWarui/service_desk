import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import IssuesController from '../controllers/IssuesController';
import CategoriesController from '../controllers/CategoriesController';
import AssignmentsController from '../controllers/AssignmentsController';
// import Authorization from '../controllers/AuthController';

const router = express.Router();

router.get('/', AppController.getHomepage);

// Users
router.post('/user', UsersController.createUser);
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUser);
router.patch('/user/me', UsersController.updateUser);

// Categories
router.get('/categories', CategoriesController.getAllCategories);
router.post('/categories', CategoriesController.createCategory);
router.get('/categories/:id', CategoriesController.getCategory);

// Issues
router.post('/issues', IssuesController.createNewIssue);
router.get('/issues', IssuesController.getAllIssues);
router.get('/issues/:id', IssuesController.getIssue);
router.patch('/issues/:id', IssuesController.updateIssue);
router.delete('/issues/:id', IssuesController.deleteIssue);
router.get('/users/:id/issues', IssuesController.getIssuesByUser);
router.get('/categories/:id/issues', IssuesController.getIssuesByCategory);
router.get('/issues/search', IssuesController.searchIssues);

// // Assignments
router.post('/issues/:issueId/assignments', AssignmentsController.createAssignment);
router.get('/issues/:issueId/assignments', AssignmentsController.getIssueAssignments);
router.get('/assignments', AssignmentsController.getAllAssignments);
router.get('/assignments/:assignmentId', AssignmentsController.getAssignmentDetails);
// router.post('/assignments', AssignmentsController.updateAllAssignments);
router.get('/techAssignments/:technicianId', AssignmentsController.getAssignmentsByTechnicianId);
router.patch('/assignments/:assignmentId', AssignmentsController.updateAssignment);



export default router;
