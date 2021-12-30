export interface ParsedBedwars {
  coins: string;
  overall: BWStats;
  solos: BWStats;
  duos: BWStats;
  threes: BWStats;
  four_four: BWStats;
  two_four: BWStats;
}

export interface BWStats {
  winstreak: string;
  kills: string;
  deaths: string;
  kdr: string;
  finalKills: string;
  finalDeaths: string;
  fkdr: string;
  wins: string;
  losses: string;
  wlr: string;
  bedsBroken: string;
  bedsLost: string;
  bblr: string;
  gamesPlayed: string;
  finals_per_game: string;
  beds_per_game: string;
}
