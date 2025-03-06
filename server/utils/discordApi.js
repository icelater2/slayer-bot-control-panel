import axios from 'axios';
import { Client, GatewayIntentBits } from 'discord.js';
import config from '../config/index.js';

// Initialize Discord.js client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

// Login with bot token
const initializeBot = async () => {
  try {
    await client.login(config.discord.botToken);
    console.log(`Bot logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to login to Discord:', error);
    throw error;
  }
};

// Exchange authorization code for access token
const exchangeCodeForToken = async (code) => {
  try {
    const params = new URLSearchParams({
      client_id: config.discord.clientId,
      client_secret: config.discord.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.discord.redirectUri,
      scope: config.discord.scopes.join(' ')
    });

    const response = await axios.post(
      `${config.discord.apiEndpoint}/oauth2/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Discord');
  }
};

// Get user information from Discord
const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(`${config.discord.apiEndpoint}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error.response?.data || error.message);
    throw new Error('Failed to get user information from Discord');
  }
};

// Get user's guilds from Discord
const getUserGuilds = async (accessToken) => {
  try {
    const response = await axios.get(`${config.discord.apiEndpoint}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Get the list of guilds where the bot is present
    const botGuilds = client.guilds.cache.map(guild => guild.id);

    // Filter and enhance guild data
    const enhancedGuilds = response.data.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions,
      features: guild.features,
      hasBot: botGuilds.includes(guild.id),
      canManage: (parseInt(guild.permissions) & 0x8) === 0x8 // Check for ADMINISTRATOR permission
    }));

    return enhancedGuilds;
  } catch (error) {
    console.error('Error getting user guilds:', error.response?.data || error.message);
    throw new Error('Failed to get user guilds from Discord');
  }
};

// Get guild channels
const getGuildChannels = async (guildId) => {
  try {
    const guild = client.guilds.cache.get(guildId);
    
    if (!guild) {
      throw new Error('Guild not found or bot is not a member of this guild');
    }

    // Fetch all channels
    await guild.channels.fetch();
    
    // Filter to only text channels and sort by position
    const textChannels = guild.channels.cache
      .filter(channel => channel.type === 0) // 0 is GUILD_TEXT
      .sort((a, b) => a.position - b.position)
      .map(channel => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        position: channel.position,
        parent_id: channel.parentId
      }));

    return textChannels;
  } catch (error) {
    console.error('Error getting guild channels:', error);
    throw new Error('Failed to get guild channels');
  }
};

// Check if user has permission to manage a guild
const checkGuildPermission = async (userId, guildId) => {
  try {
    const guild = client.guilds.cache.get(guildId);
    
    if (!guild) {
      return false;
    }

    // Fetch guild member
    const member = await guild.members.fetch(userId);
    
    if (!member) {
      return false;
    }

    // Check if user is admin or has manage guild permission
    return member.permissions.has('ADMINISTRATOR') || member.permissions.has('MANAGE_GUILD');
  } catch (error) {
    console.error('Error checking guild permission:', error);
    return false;
  }
};

export {
  client,
  initializeBot,
  exchangeCodeForToken,
  getUserInfo,
  getUserGuilds,
  getGuildChannels,
  checkGuildPermission
};