import mongoose from 'mongoose';

const guildLanguageSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  language: { 
    type: String, 
    default: 'tr', 
    enum: ['tr', 'en', 'es', 'ru', 'zh', 'fr', 'pt', 'ja', 'ko', 'de'] 
  }
}, { timestamps: true });

// Create or update guild language
guildLanguageSchema.statics.createOrUpdate = async function(guildId, language) {
  return this.findOneAndUpdate(
    { guildId },
    { guildId, language },
    { new: true, upsert: true }
  );
};

const GuildLanguage = mongoose.model('GuildLanguage', guildLanguageSchema);

export default GuildLanguage;