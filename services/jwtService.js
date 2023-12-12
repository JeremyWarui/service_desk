/* eslint-disable no-useless-catch */
/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';

class JWTService {
  async generateToken(userName, userRole) {
    const payload = { userName, userRole };
    const secret = process.env.TOKEN_SECRET;
    const options = {
      algorithm: 'HS256',
      expiresIn: process.env.TOKEN_EXPIRE,
    };

    const token = await jwt.sign(payload, secret, options);
    return token;
  }

  async refresh(userName, userRole, req, res) {
    // Get the refresh token from the cookie
    const { refreshToken } = req.cookies;
    // If there is no refresh token, return an error
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    // Verify the refresh token
    try {
    //   const decoded = await jwt.verify(
    //     refreshToken,
    //     process.env.REFRESH_TOKEN_SECRET,
    //   );
      // If the refresh token is valid, create a new payload with the updated user information
      const payload = { userName, userRole };
      // Sign a new access token with the same secret and options
      const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: process.env.TOKEN_EXPIRE,
      });
      // Return the new access token
      return res.json({ token });
    } catch (error) {
      // If the refresh token is invalid or expired, return an error
      return res
        .status(403)
        .json({ message: 'Invalid or expired refresh token' });
    }
  }

  async verifyToken(token) {
    // The secret can be the same as the one used to sign the token
    const secret = process.env.TOKEN_SECRET;
    // The options can include the algorithms to accept
    const options = {
      algorithms: ['HS256'], // HMAC-SHA256
    };
    try {
      // The verify method returns the decoded payload if the token is valid
      const payload = await jwt.verify(token, secret, options);
      return payload;
    } catch (error) {
      // The verify method throws an error if the token is invalid or expired
      throw error;
    }
  }
}

export default JWTService;
