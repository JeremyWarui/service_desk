// db/index.js
import dbService from '../services/dbService';
import Category from './Category';
import Issue from './Issue';
import User from './User';
import Assignment from './Assignment';

// Set up associations
Category.hasMany(Issue, { foreignKey: 'category_id' });
Issue.belongsTo(Category, { foreignKey: 'category_id' });
Issue.belongsTo(User, { as: "creator", foreignKey: "user_id" });
Issue.belongsTo(User, { as: "assignee", foreignKey: "assigned_to" });
Issue.hasMany(Assignment, { foreignKey: "issue_id" });
Assignment.belongsTo(User, { as: 'technician', foreignKey: 'technician_id' });
Assignment.belongsTo(Issue, { foreignKey: 'issue_id' });
User.hasMany(Issue, { as: 'created_issues', foreignKey: 'user_id' });
User.hasMany(Issue, { as: 'assigned_issues', foreignKey: 'assigned_to' });
User.hasMany(Assignment, {
  as: 'technician_assignments',
  foreignKey: 'technician_id',
});


// Export models and dbService
export { dbService, Category, Issue, User, Assignment };
