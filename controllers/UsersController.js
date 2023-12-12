import { models } from '../services/dbService';
import { v4 as uuidv4 } from 'uuid';
const { User } = models;

class UsersController {
  static async createNewUser(req, res) {
    const { userName, password, role, email } = req.body;
    if (!userName) return res.status(400).json({ error: 'Missing username'});
    if (!password) return res.status(400).json({ error: 'Missing password'});
    if (!role) return res.status(400).json({error: 'Missing user role'});
    if (!email) return res.status(400).json({error: 'Missing email'});
    const user = await User.create({
        id: uuidv4(),
        user_name: userName,
        user_email: email,
        user_role: role
    });

    res.status(201).json({user});
  }
}

export default UsersController;
