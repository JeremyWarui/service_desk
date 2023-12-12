import db from "../utils/db";
import { DataTypes } from "Sequelize";
import Category from "../models/Category";
import User from "../models/User";

const Issue = db.define("Issue", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
  issue_message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issue_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "open",
  },
  issue_resolution: {
    type: DataTypes.STRING,
  },
  issue_assignment: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  assigned_to: {
    type: DataTypes.UUID,
  },
  resolved_date: {
    type: DataTypes.DATE,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

Issue.belongsTo(User, { as: "creator", foreignKey: "user_id" });
Issue.belongsTo(User, { as: "assignee", foreignKey: "assigned_to" });
Issue.hasMany(Assignment, { foreignKey: "issue_id" });

export default Issue;
