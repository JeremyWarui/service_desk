class AppController {
  static async getHomepage(req, res) {
    res.status(200).json("Welcome to service desk 101!");
  }
}
export default AppController;
