import { DataTypes } from 'sequelize';
import dbService from '../services/dbService';
// import User from './User';
// import Issue from './Issue';

const Assignment = dbService.db.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  technician_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  issue_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Assignment.belongsTo(User, { as: 'technician', foreignKey: 'technician_id' });
// Assignment.belongsTo(Issue, { foreignKey: 'issue_id' });

Assignment.sync()
  .then(() => console.log('Assignment table created successfully'))
  .catch(error => console.error('Failed to create Assignment table:', error));

export default Assignment;