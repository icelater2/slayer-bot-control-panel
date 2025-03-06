import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { checkGuildPermission } from '../utils/discordApi.js';

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if user has permission to manage the guild
export const checkGuildAccess = async (req, res, next) => {
  const { guildId } = req.params;
  const userId = req.user.id;

  if (!guildId) {
    return res.status(400).json({ message: 'Guild ID is required' });
  }

  try {
    const hasPermission = await checkGuildPermission(userId, guildId);
    
    if (!hasPermission) {
      return res.status(403).json({ message: 'You do not have permission to manage this guild' });
    }
    
    next();
  } catch (error) {
    console.error('Error checking guild access:', error);
    return res.status(500).json({ message: 'Failed to verify guild access' });
  }
};