import {DataTypes} from Sequelize;
import db from '../utils/db';

const User = db.define('User', {
  id: {
    type:DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,    
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,    
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_role: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
});
User.hasMany(Issue, { as: 'created_issues', foreignKey: 'user_id' });
User.hasMany(Issue, { as: 'assigned_issues', foreignKey: 'assigned_to' });
User.hasMany(Assignment, { as: 'technician_assignments', foreignKey: 'technician_id' });

export default User;