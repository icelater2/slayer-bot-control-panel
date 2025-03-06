import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { exchangeCodeForToken, getUserInfo } from '../utils/discordApi.js';

// Handle Discord OAuth2 callback
export const handleDiscordCallback = async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  try {
    // Exchange code for token
    const tokenData = await exchangeCodeForToken(code);
    
    // Get user info
    const userData = await getUserInfo(tokenData.access_token);
    
    // Create JWT token
    const token = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator || '0',
        avatar: userData.avatar,
        accessToken: tokenData.access_token
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Return JWT token
    return res.status(200).json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 604800 // 7 days in seconds
    });
  } catch (error) {
    console.error('Error in Discord callback:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
  try {
    // User data is already in the request from the verifyToken middleware
    const { id, username, discriminator, avatar } = req.user;
    
    return res.status(200).json({
      id,
      username,
      discriminator,
      avatar
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({ message: 'Failed to get user information' });
  }
};