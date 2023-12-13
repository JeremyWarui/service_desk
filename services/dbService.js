import { Sequelize } from "sequelize";

class DBService {
  constructor() {
    this.db = new Sequelize(phttps://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@github.com/JeremyWarui/service_desk.git,
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