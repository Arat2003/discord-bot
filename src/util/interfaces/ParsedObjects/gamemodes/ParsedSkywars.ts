import { KDRWLR } from "../KDRWLR";

export interface ParsedSkywars {
  // winstreak: string;
  coins: string;
  level: string;
  souls: string;
  overall: KDRWLR;
  solos: SWStatsInsane;
  teams: SWStatsInsane;
  ranked: KDRWLR;
}

export interface SWStatsInsane {
  normalKills: string;
  normalDeaths: string;
  normalKdr: string;
  normalWins: string;
  normalLosses: string;
  normalWlr: string;

  insaneKills: string;
  insaneDeaths: string;
  insaneKdr: string;
  insaneWins: string;
  insaneLosses: string;
  insaneWlr: string;
}
