import { addCommas, capitalize } from "../../functions/textFunctions";
import { ArcadeTypes } from "../../interfaces/gametypes";
import { ParsedArcade } from "../../interfaces/ParsedObjects/gamemodes/ParsedArcade";

// hitw_record_q
// hitw_record_f hole in the wall record qualis and finals
// missing pixel painters

export default function arcadeWrapper(stats: any | null) {
  let galaxyWarsKills =
    (stats.sw_empire_kills ? stats.sw_empire_kills : 0) +
    (stats.sw_rebel_kills ? stats.sw_rebel_kills : 0);
  let galaxyWarsDeaths = stats.sw_deaths ? stats.sw_deaths : 0;

  let hypixelSaysRounds =
    (stats.rounds_simon_says ? stats.rounds_simon_says : 0) +
    (stats.rounds_santa_says ? stats.rounds_santa_says : 0);
  let hypixelSaysWins = stats.wins_simon_says ? stats.wins_simon_says : 0;
  let hypixelSaysLosses = hypixelSaysRounds - hypixelSaysWins;

  let arrowsHitMiniWalls = stats.arrows_hit_mini_walls
    ? stats.arrows_hit_mini_walls
    : 0;
  let arrowsShotMiniWalls = stats.arrows_shot_mini_walls
    ? stats.arrows_shot_mini_walls
    : 0;

  let killsZombies = stats.zombie_kills_zombies
    ? stats.zombie_kills_zombies
    : 0;
  let deathsZombies = stats.deaths_zombies ? stats.deaths_zombies : 0;

  let parsed: ParsedArcade = {
    coins: addCommas(`${stats.coins}`),
    blockingDead: {
      wins: parseWins(stats, "dayone"),
      kills: parseKills(stats, "dayone"),
      headshots: addCommas(`${stats.headshots_dayone}`),
    },
    oneInTheQuiver: {
      bounty_kills: addCommas(`${stats.bounty_kills_oneinthequiver}`),
      kills: parseKills(stats, "oneinthequiver"),
      deaths: parseDeaths(stats, "oneinthequiver"),
      kdr: parseKDR(stats, "oneinthequiver"),
      wins: parseWins(stats, "oneinthequiver"),
    },
    dragonWars: {
      wins: parseWins(stats, "dragonwars2"),
      kills: parseKills(stats, "dragonwars2"),
    },
    enderSpleef: {
      trail: stats.enderspleef_trail
        ? `${capitalize(stats.enderspleef_trail)}`
        : "None",
      wins: parseWins(stats, "enderspleef"),
    },
    farmHunt: {
      wins: parseWins(stats, "farm_hunt"),
      poop_collected: addCommas(`${stats.poop_collected}`),
    },
    galaxyWars: {
      deaths: addCommas(`${galaxyWarsDeaths}`),
      empire_kills: addCommas(`${stats.sw_empire_kills}`),
      kdr: (
        galaxyWarsKills / (galaxyWarsDeaths === 0 ? 1 : galaxyWarsDeaths)
      ).toFixed(2),
      kills: addCommas(`${galaxyWarsKills}`),
      rebel_kills: addCommas(`${stats.sw_rebel_kills}`),
      shots_fired: addCommas(`${stats.sw_shots_fired}`),
      wins: addCommas(`${stats.sw_game_wins}`),
    },
    hideAndSeek: {
      hider_wins: addCommas(`${stats.hider_wins_hide_and_seek}`),
      party_pooper_hider_wins: addCommas(
        `${stats.party_pooper_hider_wins_hide_and_seek}`
      ),
      party_pooper_seeker_wins: addCommas(
        `${stats.party_pooper_seeker_wins_hide_and_seek}`
      ),
      seeker_wins: addCommas(`${stats.seeker_wins_hide_and_seek}`),
    },
    holeInTheWall: {
      rounds_played: parseRounds(stats, "hole_in_the_wall"),
      wins: parseWins(stats, "hole_in_the_wall"),
      wlr: parseWLR(stats, "hole_in_the_wall"),
    },
    hypixelSays: {
      rounds_played: addCommas(`${hypixelSaysRounds}`),
      wins: addCommas(`${hypixelSaysWins}`),
      wlr: (
        hypixelSaysWins / (hypixelSaysLosses === 0 ? 1 : hypixelSaysLosses)
      ).toFixed(2),
    },
    miniWalls: {
      kills: parseKills(stats, "mini_walls"),
      deaths: parseDeaths(stats, "mini_walls"),
      kdr: parseKDR(stats, "mini_walls"),
      wins: parseWins(stats, "mini_walls"),
      kit: capitalize(`${stats.miniwalls_activeKit}`),
      arrows_hit: addCommas(`${arrowsHitMiniWalls}`),
      arrows_shot: addCommas(`${arrowsShotMiniWalls}`),
      bow_accuracy: (
        (arrowsHitMiniWalls /
          (arrowsShotMiniWalls === 0 ? 1 : arrowsShotMiniWalls)) *
        100
      ).toFixed(2),
      finalKills: addCommas(`${stats.final_kills_mini_walls}`),
      wither_damage: addCommas(`${stats.wither_damage_mini_walls}`),
      wither_kills: addCommas(`${stats.wither_kills_mini_walls}`),
    },
    partyGames: {
      wins: addCommas(
        `${
          (stats.wins_party ? stats.wins_party : 0) +
          (stats.wins_party_3 ? stats.wins_party_3 : 0) +
          (stats.wins_party_2 ? stats.wins_party_2 : 0)
        }`
      ),
    },
    scubaSimulator: {
      items_found: addCommas(`${stats.items_found_scuba_simulator}`),
      points: addCommas(`${stats.total_points_scuba_simulator}`),
      wins: parseWins(stats, "scuba_simulator"),
    },
    soccer: {
      wins: parseWins(stats, "soccer"),
      goals: addCommas(`${stats.goals_soccer}`),
      kicks: addCommas(`${stats.kicks_soccer}`),
      powerkicks: addCommas(`${stats.powerkicks_soccer}`),
    },
    throwOut: {
      deaths: parseDeaths(stats, "throw_out"),
      kills: parseKills(stats, "throw_out"),
      kdr: parseDeaths(stats, "throw_out"),
      wins: parseWins(stats, "throw_out"),
    },
    zombies: {
      highest_round: addCommas(`${stats.best_round_zombies}`),
      downs: addCommas(`${stats.times_knocked_down_zombies}`),
      deaths: addCommas(`${deathsZombies}`),
      kills: addCommas(`${killsZombies}`),
      doors_opened: addCommas(`${stats.doors_opened_zombies}`),
      windows_repaired: addCommas(`${stats.windows_repaired_zombies}`),
      players_revived: addCommas(`${stats.players_revived_zombies}`),
      kdr: (killsZombies / (deathsZombies === 0 ? 1 : deathsZombies)).toFixed(
        2
      ),
    },
  };

  return parsed;
}

function parseWins(stats: any | null, type: ArcadeTypes) {
  return addCommas(`${stats[`wins_${type}`]}`);
}

function parseKills(stats: any | null, type: ArcadeTypes) {
  return addCommas(`${stats[`kills_${type}`]}`);
}

function parseDeaths(stats: any | null, type: ArcadeTypes) {
  return addCommas(`${stats[`deaths_${type}`]}`);
}

function parseRounds(stats: any | null, type: ArcadeTypes) {
  return addCommas(`${stats[`rounds_${type}`]}`);
}

function parseKDR(stats: any | null, type: ArcadeTypes) {
  return (
    (stats[`kills_${type}`] ? stats[`kills_${type}`] : 0) /
    (stats[`deaths_${type}`] ? stats[`deaths_${type}`] : 1)
  ).toFixed(2);
}

function parseWLR(stats: any | null, type: ArcadeTypes) {
  let wins: any = stats[`wins_${type}`] ? stats[`wins_${type}`] : 0;
  let losses: any =
    (stats[`rounds_${type}`] ? stats[`rounds_${type}`] : 0) - wins;
  return (wins / (losses === 0 ? 1 : losses)).toFixed(2);
}
