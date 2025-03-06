import mongoose from 'mongoose';

const logChannelSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  durumRolLog: { type: String, default: null },
  ticketLog: { type: String, default: null },
  emojiLog: { type: String, default: null },
  mesajLog: { type: String, default: null },
  seviyeLog: { type: String, default: null },
  isimLog: { type: String, default: null },
  sesLog: { type: String, default: null },
  kanalLog: { type: String, default: null },
  davetLog: { type: String, default: null },
  girisCikisLog: { type: String, default: null },
  banKickLog: { type: String, default: null },
  muteLog: { type: String, default: null },
  jailLog: { type: String, default: null },
  modLog: { type: String, default: null }
}, { timestamps: true });

// Create or update log channels
logChannelSchema.statics.createOrUpdate = async function(guildId, logChannelData) {
  return this.findOneAndUpdate(
    { guildId },
    { ...logChannelData, guildId },
    { new: true, upsert: true }
  );
};

const LogChannel = mongoose.model('LogChannel', logChannelSchema);

export default LogChannel;