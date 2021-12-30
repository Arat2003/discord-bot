import { addCommas } from "../../functions/textFunctions";
import { CrazyWallsTypes } from "../../interfaces/gametypes";
import { ParsedCrazyWalls } from "../../interfaces/ParsedObjects/gamemodes/ParsedCrazyWalls";
import { KDRWLR } from "../../interfaces/ParsedObjects/KDRWLR";

export default function crazyWallsWrapper(stats: any | null) {
  const parsed: ParsedCrazyWalls = {
    soloNormal: parseType(stats, "solo"),
    soloLucky: parseType(stats, "solo_chaos"),
    teamsNormal: parseType(stats, "team"),
    teamsLucky: parseType(stats, "team_chaos"),
    overall: parseOverall(stats),
  };

  return parsed;
}

function parseType(stats: any | null, type: CrazyWallsTypes): KDRWLR {
  let obj: KDRWLR = {
    kills: addCommas(`${stats[`crazywalls_kills_${type}`]}`),
    deaths: addCommas(`${stats[`crazywalls_deaths_${type}`]}`),
    kdr: (
      (stats[`crazywalls_kills_${type}`]
        ? stats[`crazywalls_kills_${type}`]
        : 0) /
      (stats[`crazywalls_deaths_${type}`]
        ? stats[`crazywalls_deaths_${type}`]
        : 1)
    ).toFixed(2),
    wins: addCommas(`${stats[`crazywalls_wins_${type}`]}`),
    losses: addCommas(`${stats[`crazywalls_losses_${type}`]}`),
    wlr: (
      (stats[`crazywalls_wins_${type}`]
        ? stats[`crazywalls_wins_${type}`]
        : 0) /
      (stats[`crazywalls_losses_${type}`]
        ? stats[`crazywalls_losses_${type}`]
        : 1)
    ).toFixed(2),
  };

  return obj;
}

function parseOverall(stats: any | null) {
  let kills =
    (stats[`crazywalls_kills_solo`] ? stats[`crazywalls_kills_solo`] : 0) +
    (stats[`crazywalls_kills_solo_chaos`]
      ? stats[`crazywalls_kills_solo_chaos`]
      : 0) +
    (stats[`crazywalls_kills_team`] ? stats[`crazywalls_kills_team`] : 0) +
    (stats[`crazywalls_kills_team_chaos`]
      ? stats[`crazywalls_kills_team_chaos`]
      : 0);

  let deaths =
    (stats[`crazywalls_deaths_solo`] ? stats[`crazywalls_deaths_solo`] : 0) +
    (stats[`crazywalls_deaths_solo_chaos`]
      ? stats[`crazywalls_deaths_solo_chaos`]
      : 0) +
    (stats[`crazywalls_deaths_team`] ? stats[`crazywalls_deaths_team`] : 0) +
    (stats[`crazywalls_deaths_team_chaos`]
      ? stats[`crazywalls_deaths_team_chaos`]
      : 0);

  let kdr = ((kills ? kills : 0) / (deaths != 0 ? deaths : 1)).toFixed(2);

  let wins =
    (stats[`crazywalls_wins_solo`] ? stats[`crazywalls_wins_solo`] : 0) +
    (stats[`crazywalls_wins_solo_chaos`]
      ? stats[`crazywalls_wins_solo_chaos`]
      : 0) +
    (stats[`crazywalls_wins_team`] ? stats[`crazywalls_wins_team`] : 0) +
    (stats[`crazywalls_wins_team_chaos`]
      ? stats[`crazywalls_wins_team_chaos`]
      : 0);

  let losses =
    (stats[`crazywalls_losses_solo`] ? stats[`crazywalls_losses_solo`] : 0) +
    (stats[`crazywalls_losses_solo_chaos`]
      ? stats[`crazywalls_losses_solo_chaos`]
      : 0) +
    (stats[`crazywalls_losses_team`] ? stats[`crazywalls_losses_team`] : 0) +
    (stats[`crazywalls_losses_team_chaos`]
      ? stats[`crazywalls_losses_team_chaos`]
      : 0);

  let wlr = ((wins ? wins : 0) / (losses != 0 ? losses : 1)).toFixed(2);

  let obj: KDRWLR = {
    kills: addCommas(`${kills}`),
    deaths: addCommas(`${deaths}`),
    kdr,
    wins: addCommas(`${wins}`),
    losses: addCommas(`${losses}`),
    wlr,
  };

  return obj;
}
