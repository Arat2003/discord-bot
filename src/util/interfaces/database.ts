export interface DbUser {
  userID: string;
  minecraftUUID: string;
  isLinked: boolean;
}

export interface DbGuild {
  guildID: string;
  prefix: string;
  language: string;
  guildOwnerID: string;
  prefixChangeAllowedRoles?: string[];
  ignoredChannels?: string[];
}
