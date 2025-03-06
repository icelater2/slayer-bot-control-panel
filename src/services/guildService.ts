import axios from 'axios';
import { Guild, Channel, LogChannels, GuildLanguage } from '../types';

// API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get user's guilds
export const getUserGuilds = async (token: string): Promise<Guild[]> => {
  try {
    const response = await axios.get(`${API_URL}/guilds`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting user guilds:', error);
    throw new Error('Failed to get user guilds');
  }
};

// Get guild channels
export const getGuildChannels = async (guildId: string, token: string): Promise<Channel[]> => {
  try {
    const response = await axios.get(`${API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting guild channels:', error);
    throw new Error('Failed to get guild channels');
  }
};

// Get log channels configuration
export const getLogChannels = async (guildId: string, token: string): Promise<LogChannels> => {
  try {
    const response = await axios.get(`${API_URL}/guilds/${guildId}/logs`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting log channels:', error);
    throw new Error('Failed to get log channel configuration');
  }
};

// Update log channels configuration
export const updateLogChannels = async (logChannels: LogChannels, token: string): Promise<LogChannels> => {
  try {
    const response = await axios.put(`${API_URL}/guilds/${logChannels.guildId}/logs`, logChannels, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating log channels:', error);
    throw new Error('Failed to update log channel configuration');
  }
};

// Get guild language
export const getGuildLanguage = async (guildId: string, token: string): Promise<GuildLanguage> => {
  try {
    const response = await axios.get(`${API_URL}/guilds/${guildId}/language`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting guild language:', error);
    throw new Error('Failed to get guild language setting');
  }
};

// Update guild language
export const updateGuildLanguage = async (guildLanguage: GuildLanguage, token: string): Promise<GuildLanguage> => {
  try {
    const response = await axios.put(`${API_URL}/guilds/${guildLanguage.guildId}/language`, guildLanguage, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating guild language:', error);
    throw new Error('Failed to update guild language setting');
  }
};