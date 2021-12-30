import { addCommas } from "../../functions/textFunctions";
import { SkyClashTypes } from "../../interfaces/gametypes";
import { ParsedSkyClash } from "../../interfaces/ParsedObjects/gamemodes/ParsedSkyClash";
import { KDRWLR } from "../../interfaces/ParsedObjects/KDRWLR";

export default function skyClashWrapper(stats: any | null) {
  const parsed: ParsedSkyClash = {
    coins: addCommas(`${stats.coins}`),
    overall: parseTypes(stats, ""),
    solo: parseTypes(stats, "_solo"),
    doubles: parseTypes(stats, "_doubles"),
    teamWar: parseTypes(stats, "_team_war"),
  };

  return parsed;
}

function parseTypes(stats: any | null, type: SkyClashTypes) {
  const obj: KDRWLR = {
    kills: addCommas(`${stats[`kills${type}`]}`),
    deaths: addCommas(`${stats[`deaths${type}`]}`),
    kdr: (
      (stats[`kills${type}`] ? stats[`kills${type}`] : 0) /
      (stats[`deaths${type}`] ? stats[`deaths${type}`] : 1)
    ).toFixed(2),
    wins: addCommas(`${stats[`wins${type}`]}`),
    losses: addCommas(`${stats[`losses${type}`]}`),
    wlr: (
      (stats[`wins${type}`] ? stats[`wins${type}`] : 0) /
      (stats[`losses${type}`] ? stats[`losses${type}`] : 1)
    ).toFixed(2),
  };

  return obj;
}
