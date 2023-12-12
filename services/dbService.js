// Import Sequelize
import Sequelize from 'sequelize';

// Create a Sequelize instance
const db = new Sequelize('postgres://localhost:5432/petOwners');

// Import all the models from the models folder
const models = db.import('../models');

// Set up the associations between the models
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Synchronize the models with the database
try {
  db.sync({ force: true }); // Use force: true only for development and testing
  console.log('Database synchronized successfully');
} catch (error) {
  console.error('Database not synchronized successfully');
}

// Export the db object and the models
export { db, models };
