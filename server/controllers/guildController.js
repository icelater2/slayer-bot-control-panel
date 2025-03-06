import { getUserGuilds, getGuildChannels } from '../utils/discordApi.js';
import LogChannel from '../models/LogChannel.js';
import GuildLanguage from '../models/GuildLanguage.js';

// Get user's guilds
export const getUserGuildsController = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const guilds = await getUserGuilds(accessToken);
    
    return res.status(200).json(guilds);
  } catch (error) {
    console.error('Error getting user guilds:', error);
    return res.status(500).json({ message: 'Failed to get user guilds' });
  }
};

// Get guild channels
export const getGuildChannelsController = async (req, res) => {
  try {
    const { guildId } = req.params;
    const channels = await getGuildChannels(guildId);
    
    return res.status(200).json(channels);
  } catch (error) {
    console.error('Error getting guild channels:', error);
    return res.status(500).json({ message: 'Failed to get guild channels' });
  }
};

// Get log channels configuration
export const getLogChannelsController = async (req, res) => {
  try {
    const { guildId } = req.params;
    
    let logChannels = await LogChannel.findOne({ guildId });
    
    if (!logChannels) {
      // Create default log channels configuration
      logChannels = await LogChannel.createOrUpdate(guildId, {
        durumRolLog: null,
        ticketLog: null,
        emojiLog: null,
        mesajLog: null,
        seviyeLog: null,
        isimLog: null,
        sesLog: null,
        kanalLog: null,
        davetLog: null,
        girisCikisLog: null,
        banKickLog: null,
        muteLog: null,
        jailLog: null,
        modLog: null
      });
    }
    
    return res.status(200).json(logChannels);
  } catch (error) {
    console.error('Error getting log channels:', error);
    return res.status(500).json({ message: 'Failed to get log channel configuration' });
  }
};

// Update log channels configuration
export const updateLogChannelsController = async (req, res) => {
  try {
    const { guildId } = req.params;
    const logChannelData = req.body;
    
    // Validate input
    if (!logChannelData) {
      return res.status(400).json({ message: 'Log channel data is required' });
    }
    
    // Update log channels
    const updatedLogChannels = await LogChannel.createOrUpdate(guildId, logChannelData);
    
    return res.status(200).json(updatedLogChannels);
  } catch (error) {
    console.error('Error updating log channels:', error);
    return res.status(500).json({ message: 'Failed to update log channel configuration' });
  }
};

// Get guild language
export const getGuildLanguageController = async (req, res) => {
  try {
    const { guildId } = req.params;
    
    let guildLanguage = await GuildLanguage.findOne({ guildId });
    
    if (!guildLanguage) {
      // Create default language setting
      guildLanguage = await GuildLanguage.createOrUpdate(guildId, 'tr');
    }
    
    return res.status(200).json(guildLanguage);
  } catch (error) {
    console.error('Error getting guild language:', error);
    return res.status(500).json({ message: 'Failed to get guild language setting' });
  }
};

// Update guild language
export const updateGuildLanguageController = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { language } = req.body;
    
    // Validate input
    if (!language) {
      return res.status(400).json({ message: 'Language is required' });
    }
    
    // Validate language code
    const validLanguages = ['tr', 'en', 'es', 'ru', 'zh', 'fr', 'pt', 'ja', 'ko', 'de'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ message: 'Invalid language code' });
    }
    
    // Update language
    const updatedLanguage = await GuildLanguage.createOrUpdate(guildId, language);
    
    return res.status(200).json(updatedLanguage);
  } catch (error) {
    console.error('Error updating guild language:', error);
    return res.status(500).json({ message: 'Failed to update guild language setting' });
  }
};