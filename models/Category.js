import {DataTypes} from Sequelize;
import db from '../utils/db';

const Category = db.define('Category', {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    category_name: {
        type: DataTypes.STRING,
        unique: true
    }
});

Category.hasMany(Issue, { foreignKey: 'category_id' });

export default Category;