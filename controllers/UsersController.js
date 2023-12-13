import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';


class UsersController {
  static async createUser(req, res) {
    try {
      const {
        userName, password, role, email,
      } = req.body;
      //validate the request body
      if (!userName) return res.status(400).json({ error: 'Missing username' });
      // if (!password) return res.status(400).json({ error: 'Missing password' });
      if (!role) return res.status(400).json({ error: 'Missing user role' });
      if (!email) return res.status(400).json({ error: 'Missing email' });

      //create new user
      const user = await User.create({
        id: uuidv4(),
        user_name: userName,
        user_email: email,
        user_role: role,
      });
  
      return res.status(201).json({ user });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: 'Something went wrong'});
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.status(200).json({users});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  static async getUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({error: 'User not found'})
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
}

export default UsersController;
