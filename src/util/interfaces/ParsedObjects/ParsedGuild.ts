import { KeyValuePair } from "../KeyValuePair";

export interface HypixelGuild {
  name: string;
  guildMaster: string;
  createdOn: string;
  tag: string | null;
  guildMembers: Member[];
  memberCount: number;
  ranks: Rank[];
  exp: Exp;
  tagColor: string;
  hexColor: string;
  preferredGames: string[];
  expByGameType: GameTypes;
  totalExp: number;
  dailyXP: KeyValuePair<DailyXPType>;
  weeklyXP: number;
  scaledWeekly: number;
}

export type Member = {
  uuid: string;
  rank: string;
  joined: number;
  questParticipation: number;
  expHistory: KeyValuePair<number>;
};

export interface Rank {
  name: string;
  default?: boolean;
  tag?: string;
  created?: number;
  priority: number;
  members: Member[];
}

interface Exp {
  level: number;
  xpNeeded: number;
}

interface GameTypes {
  REPLAY: number;
  PIT: number;
  LEGACY: number;
  SPEED_UHC: number;
  WALLS3: number;
  TNTGAMES: number;
  ARCADE: number;
  SURVIVAL_GAMES: number;
  SUPER_SMASH: number;
  BATTLEGROUND: number;
  ARENA: number;
  QUAKECRAFT: number;
  DUELS: number;
  WALLS: number;
  PROTOTYPE: number;
  SKYBLOCK: number;
  SKYWARS: number;
  BEDWARS: number;
  HOUSING: number;
  GINGERBREAD: number;
  UHC: number;
  PAINTBALL: number;
  BUILD_BATTLE: number;
  MURDER_MYSTERY: number;
  MCGO: number;
  VAMPIREZ: number;
}

export type DailyXPType = {
  raw: number;
  scaled: number;
};
