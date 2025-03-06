// User types
export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

// Guild/Server types
export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  hasBot: boolean;
  canManage: boolean;
}

// Log Channel types
export interface LogChannels {
  guildId: string;
  durumRolLog: string | null;
  ticketLog: string | null;
  emojiLog: string | null;
  mesajLog: string | null;
  seviyeLog: string | null;
  isimLog: string | null;
  sesLog: string | null;
  kanalLog: string | null;
  davetLog: string | null;
  girisCikisLog: string | null;
  banKickLog: string | null;
  muteLog: string | null;
  jailLog: string | null;
  modLog: string | null;
}

// Guild Language types
export interface GuildLanguage {
  guildId: string;
  language: 'tr' | 'en' | 'es' | 'ru' | 'zh' | 'fr' | 'pt' | 'ja' | 'ko' | 'de';
}

// Discord Channel types
export interface Channel {
  id: string;
  name: string;
  type: number;
  position: number;
  parent_id: string | null;
}

// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}