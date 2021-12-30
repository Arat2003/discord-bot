export interface ParsedArcade {
  coins: string;
  blockingDead: BlockingDead;
  oneInTheQuiver: OneInTheQuiver;
  dragonWars: DragonWars;
  enderSpleef: EnderSpleef;
  farmHunt: FarmHunt;
  soccer: Soccer;
  scubaSimulator: ScubaSimulator;
  galaxyWars: GalaxyWars;
  holeInTheWall: HoleInTheWall;
  hideAndSeek: HideAndSeek;
  hypixelSays: HypixelSays;
  zombies: Zombies;
  throwOut: ThrowOut;
  // pixelPainters: PixelPainters;
  miniWalls: MiniWalls;
  partyGames: PartyGames;
}

interface BlockingDead {
  kills: string;
  wins: string;
  headshots: string;
}

interface OneInTheQuiver {
  // one in the quiver
  wins: string;
  kills: string;
  deaths: string;
  kdr: string;
  bounty_kills: string;
}

interface DragonWars {
  kills: string;
  wins: string;
}

interface EnderSpleef {
  wins: string;
  trail: string;
}

interface FarmHunt {
  wins: string;
  poop_collected: string;
}

interface Soccer {
  wins: string;
  goals: string;
  kicks: string;
  powerkicks: string;
}

interface GalaxyWars {
  wins: string;
  kills: string;
  deaths: string;
  kdr: string;
  empire_kills: string;
  rebel_kills: string;
  shots_fired: string;
}

interface HoleInTheWall {
  // highest_score_qualifications: string; highest_score_finals: string;
  wins: string;
  rounds_played: string;
  wlr: string;
}

interface HideAndSeek {
  seeker_wins: string;
  hider_wins: string;
  party_pooper_seeker_wins: string;
  party_pooper_hider_wins: string;
}

interface HypixelSays {
  wins: string;
  rounds_played: string;
  wlr: string;
}

interface MiniWalls {
  kit: string;
  wins: string;
  kills: string;
  deaths: string;
  kdr: string;
  arrows_shot: string;
  arrows_hit: string;
  bow_accuracy: string;
  wither_damage: string;
  wither_kills: string;
  finalKills: string;
}

interface PartyGames {
  wins: string;
}

// interface PixelPainters {
//   wins: string;
// }

interface ScubaSimulator {
  wins: string;
  points: string;
  items_found: string;
}

interface ThrowOut {
  wins: string;
  kills: string;
  deaths: string;
  kdr: string;
}

interface Zombies {
  downs: string;
  players_revived: string;
  doors_opened: string;
  windows_repaired: string;
  kills: string;
  deaths: string;
  kdr: string;
  highest_round: string;
}
