/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import { models } from '../services/dbService';
import redisClient from '../services/redisService';
import JWTService from '../services/jwtService';

const { User } = models.User;

class Authorization {
  static async getConnected(req, res) {
    const authToken = req.header('Authorization') || null;
    if (!authToken) res.status(401).json({ error: 'Unauthorized' });

    const authDecoded = Buffer.from(authToken.split(' ')[1], 'base64').toString(
      'utf-8',
    );
    const [user_name, password] = authDecoded.split(':');
    if (!user_name || !password) { res.status(401).json({ error: 'Unauthorized' }); }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Check if user email already exists
    const user = await User.findOne({
      where: { user_name, password: hashedPassword },
    });

    if (user) {
      const token = JWTService.generateToken;
      const key = `auth_${token}`;
      await redisClient.set(key, user.id, 86400);
      return res.status(200).json({ token });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getDisconnect(req, res) {
    let authToken = req.header('X-Token') || null;
    if (!authToken) res.status(401).json({ error: 'Unauthorized' });
    authToken = `auth_${authToken}`;

    const user = redisClient.get(authToken);
    if (user) {
      await redisClient.del(authToken);
      res.status(204).send();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

export default Authorization;
