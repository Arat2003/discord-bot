export interface ParsedMurderMystery {
  coins: string;
  overall: MMStats;
  classic: MMStats;
  hardcore: MMStats;
  assassins: MMStats;
}

export interface MMStats {
  games: string;
  wins: string;
  kills: string;
  deaths: string;
  kdr: string;
  bowKills: string;
  knifeKills: string;
  thrownKnifeKills: string;
}
