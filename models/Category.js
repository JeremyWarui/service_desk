import { DataTypes } from "sequelize";
import dbService from "../services/dbService";
// import Issue from "./Issue";

const Category = dbService.db.define('Category', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    category_name: {
        type: DataTypes.STRING,
        unique: true
    }
});

// Category.hasMany(Issue, { foreignKey: 'category_id' });

Category.sync()
  .then(() => console.log('Category table created successfully'))
  .catch(error => console.error('Failed to create Category table:', error));

export default Category;
