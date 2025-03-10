import axios from 'axios';
import { User } from '../types';

// API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const DISCORD_CLIENT_ID = "1201613667561639947";
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'https://panel-slayerbot.vercel.app/callback';

// Get Discord OAuth2 URL
export const getDiscordAuthUrl = (): string => {
  const scope = 'identify email guilds';
  return `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;
};

// Exchange code for token
export const exchangeCodeForToken = async (code: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/auth/discord/callback`, { 
      code,
      redirect_uri: REDIRECT_URI
    });
    return response.data.access_token;
  } catch (error: any) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to authenticate with Discord');
  }
};

// Get user info from JWT token
export const getUserInfo = async (token: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return {
      id: response.data.id,
      username: response.data.username,
      discriminator: response.data.discriminator || '0',
      avatar: response.data.avatar,
      email: response.data.email
    };
  } catch (error: any) {
    console.error('Error getting user info:', error.response?.data || error.message);
    throw new Error('Failed to get user information');
  }
};
