import dotenv from 'dotenv';
dotenv.config();

const config = {
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN,
    clientId: "1201613667561639947",
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
    scopes: ['identify', 'email', 'guilds'],
    apiEndpoint: 'https://discord.com/api/v10'
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    corsOrigins: ['https://panel-slayerbot.vercel.app', 'http://localhost:5173']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

export default config;
