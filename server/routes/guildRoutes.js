import express from 'express';
import { 
  getUserGuildsController,
  getGuildChannelsController,
  getLogChannelsController,
  updateLogChannelsController,
  getGuildLanguageController,
  updateGuildLanguageController
} from '../controllers/guildController.js';
import { verifyToken, checkGuildAccess } from '../middleware/auth.js';

const router = express.Router();

// Get user's guilds
router.get('/guilds', verifyToken, getUserGuildsController);

// Guild-specific routes with permission check
router.get('/guilds/:guildId/channels', verifyToken, checkGuildAccess, getGuildChannelsController);
router.get('/guilds/:guildId/logs', verifyToken, checkGuildAccess, getLogChannelsController);
router.put('/guilds/:guildId/logs', verifyToken, checkGuildAccess, updateLogChannelsController);
router.get('/guilds/:guildId/language', verifyToken, checkGuildAccess, getGuildLanguageController);
router.put('/guilds/:guildId/language', verifyToken, checkGuildAccess, updateGuildLanguageController);

export default router;