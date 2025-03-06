import express from 'express';
import { handleDiscordCallback, getCurrentUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Discord OAuth2 callback
router.post('/discord/callback', handleDiscordCallback);

// Get current user info
router.get('/me', verifyToken, getCurrentUser);

export default router;