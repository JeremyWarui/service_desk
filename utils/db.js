import Sequelize from "sequelize";

class Database {
  constructor() {
    this.db = new Sequelize(`postgres://localhost:5432/petOwners`);
  }

  async isConnected() {
    try {
      await this.db.authenticate();
      console.log("Connection has been established successfully.");
      return true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return false;
    }
  }
}

const db = new Database();
export default db;
