import { Sequelize } from "sequelize";

class DBService {
  constructor() {
    this.db = new Sequelize('testDb', 'jeremy', 'postgres', {
      host: 'localhost',
      dialect: 'postgres'
    });

    this.connected = true;
  }

  async isConnected() {
    try {
      await this.db.authenticate();
      this.connected = true;
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      this.connected = false;
    }
  }
}

const dbService = new DBService();
export default dbService;