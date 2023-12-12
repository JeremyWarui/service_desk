import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import IssuesController from '../controllers/IssuesController';
import Authorization from '../controllers/AuthController';

const router = express.Router();

router.get('/', AppController.getHomepage);
// authorization
router.get('/connect', Authorization.getConnected);
router.get('/disconnect', Authorization.getDisconnect);
// users
router.post('/users', UsersController.createNewUser);
router.get('/users/me');

// issues
router.get('/issues', IssuesController.getAllissues);
router.post('/issues', IssuesController.createNewIssue);
router.get('/users/:id', IssuesController.displayIssuesByUser);

export default router;
