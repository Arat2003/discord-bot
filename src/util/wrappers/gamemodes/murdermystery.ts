import { addCommas } from "../../functions/textFunctions";
import { MMTypes } from "../../interfaces/gametypes";
import {
  MMStats,
  ParsedMurderMystery,
} from "../../interfaces/ParsedObjects/gamemodes/ParsedMurderMystery";

export default function murderMysteryWrapper(stats: any | null) {
  const parsed: ParsedMurderMystery = {
    coins: addCommas(`${stats.coins}`),
    overall: parseTypes(stats, ""),
    classic: parseTypes(stats, "_MURDER_CLASSIC"),
    hardcore: parseTypes(stats, "_MURDER_HARDCORE"),
    assassins: parseTypes(stats, "_MURDER_ASSASSINS"),
  };

  return parsed;
}

function parseTypes(stats: any | null, type: MMTypes) {
  const obj: MMStats = {
    games: addCommas(`${stats[`games${type}`]}`),
    kills: addCommas(`${stats[`kills${type}`]}`),
    deaths: addCommas(`${stats[`deaths${type}`]}`),
    kdr: (
      (stats[`kills${type}`] ? stats[`kills${type}`] : 0) /
      (stats[`deaths${type}`] ? stats[`deaths${type}`] : 1)
    ).toFixed(2),
    bowKills: addCommas(`${stats[`bow_kills${type}`]}`),
    knifeKills: addCommas(`${stats[`knife_kills${type}`]}`),
    thrownKnifeKills: addCommas(`${stats[`thrown_knife_kills`]}`),
    wins: addCommas(`${stats[`wins${type}`]}`),
  };

  return obj;
}
